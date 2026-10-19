import { BuyRequest } from '../models/BuyRequest.js';
import { Listing } from '../models/Listing.js';
import { rankMatches } from '../services/matchingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMatches = asyncHandler(async (request, response) => {
  const user = request.user;
  const cropFilter = request.query.crop;
  const [listings, requests] = await Promise.all([
    Listing.find({ status: 'open', ...(cropFilter ? { crop: cropFilter } : {}) }).limit(100),
    BuyRequest.find({ status: 'open', ...(cropFilter ? { crop: cropFilter } : {}) }).limit(100),
  ]);

  const listingJson = listings.map((item) => item.toJSON());
  const requestJson = requests.map((item) => item.toJSON());

  let matches;
  if (user.role === 'farmer') {
    const mine = listingJson.filter((item) => item.ownerId === String(user.id));
    const pool = mine.length ? mine : listingJson.filter((item) => user.crops?.includes(item.crop));
    matches = rankMatches({
      listings: pool.length ? pool : listingJson,
      requests: requestJson,
      crop: cropFilter,
      region: user.region,
    });
  } else {
    const mine = requestJson.filter((item) => item.ownerId === String(user.id));
    matches = rankMatches({
      listings: listingJson,
      requests: mine.length ? mine : requestJson,
      crop: cropFilter,
      region: user.region,
    });
  }

  response.json({ success: true, data: matches });
});
