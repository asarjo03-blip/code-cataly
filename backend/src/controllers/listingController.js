import mongoose from 'mongoose';
import { BuyRequest } from '../models/BuyRequest.js';
import { Listing } from '../models/Listing.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

async function findListing(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Listing.findById(id);
}

function filtersFrom(query) {
  const filters = { category: query.category === 'livestock' ? 'livestock' : 'crop' };
  if (query.crop) filters.crop = query.crop;
  if (query.region) filters.region = query.region;
  if (query.minPrice != null) filters.askingPrice = { ...filters.askingPrice, $gte: Number(query.minPrice) };
  if (query.maxPrice != null) filters.askingPrice = { ...filters.askingPrice, $lte: Number(query.maxPrice) };
  if (query.minQty != null) filters.quantity = { $gte: Number(query.minQty) };
  if (query.q) {
    const expression = new RegExp(String(query.q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filters.$or = [{ crop: expression }, { farmerName: expression }, { village: expression }, { notes: expression }];
  }
  return filters;
}

function serializePublicListing(listing) {
  const data = listing.toJSON();
  const owner = listing.owner;
  if (owner?._id) data.ownerId = String(owner._id);
  if (owner?.privacy?.showPhoneOnListings === false) data.farmerPhone = '';
  return data;
}

export const listListings = asyncHandler(async (request, response) => {
  const filters = filtersFrom(request.query);
  filters.status = 'open';
  const listings = await Listing.find(filters).populate('owner', 'privacy').sort({ createdAt: -1 }).limit(100);
  response.json({ success: true, data: listings.map(serializePublicListing) });
});

export const listMyListings = asyncHandler(async (request, response) => {
  const listings = await Listing.find({ owner: request.user.id }).sort({ createdAt: -1 });
  response.json({ success: true, data: listings });
});

export const getListing = asyncHandler(async (request, response) => {
  const listing = await findListing(request.params.id).then((item) => item?.populate('owner', 'privacy'));
  if (!listing || listing.status !== 'open') {
    throw new HttpError(404, 'Listing not found');
  }
  response.json({ success: true, data: serializePublicListing(listing) });
});

export const createListing = asyncHandler(async (request, response) => {
  const { category, crop, quantity, unit, askingPrice, region, village, availableFrom, notes, image } = request.body;
  const listing = await Listing.create({
    owner: request.user.id,
    farmerName: request.user.name,
    farmerPhone: request.user.phone,
    category,
    crop,
    quantity,
    unit,
    askingPrice,
    region,
    village,
    availableFrom,
    notes,
    image: image || crop,
  });
  response.status(201).json({ success: true, data: listing });
});

export const updateListing = asyncHandler(async (request, response) => {
  const listing = await findListing(request.params.id);
  if (!listing) throw new HttpError(404, 'Listing not found');
  if (String(listing.owner) !== request.user.id && request.user.role !== 'admin') {
    throw new HttpError(403, 'You can only edit your own listings');
  }

  const fields = ['crop', 'quantity', 'unit', 'askingPrice', 'region', 'village', 'availableFrom', 'status', 'notes', 'image'];
  for (const field of fields) {
    if (request.body[field] !== undefined) listing[field] = request.body[field];
  }
  await listing.save();
  response.json({ success: true, data: listing });
});

export const deleteListing = asyncHandler(async (request, response) => {
  const listing = await findListing(request.params.id);
  if (!listing) throw new HttpError(404, 'Listing not found');
  if (String(listing.owner) !== request.user.id && request.user.role !== 'admin') {
    throw new HttpError(403, 'You can only remove your own listings');
  }
  await listing.deleteOne();
  response.json({ success: true });
});

export const listBuyRequests = asyncHandler(async (request, response) => {
  const filters = {
    status: 'open',
    category: request.query.category === 'livestock' ? 'livestock' : 'crop',
  };
  if (request.query.crop) filters.crop = request.query.crop;
  if (request.query.region) filters.region = request.query.region;
  const requests = await BuyRequest.find(filters).sort({ createdAt: -1 }).limit(100);
  response.json({ success: true, data: requests });
});

export const listMyBuyRequests = asyncHandler(async (request, response) => {
  const requests = await BuyRequest.find({ owner: request.user.id }).sort({ createdAt: -1 });
  response.json({ success: true, data: requests });
});

export const createBuyRequest = asyncHandler(async (request, response) => {
  const { category, crop, quantity, unit, offerPrice, region, neededBy, notes } = request.body;
  const buyRequest = await BuyRequest.create({
    owner: request.user.id,
    buyerName: request.user.name,
    buyerPhone: request.user.phone,
    category,
    crop,
    quantity,
    unit,
    offerPrice,
    region,
    neededBy,
    notes,
  });
  response.status(201).json({ success: true, data: buyRequest });
});
