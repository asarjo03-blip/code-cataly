import mongoose from 'mongoose';
import { Advisory } from '../models/Advisory.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export const listAdvisories = asyncHandler(async (request, response) => {
  const filters = { published: true };
  if (request.query.category && request.query.category !== 'all') filters.category = request.query.category;
  if (request.query.crop) filters.$or = [{ crop: request.query.crop }, { crop: null }];
  if (request.query.q) {
    const expression = new RegExp(String(request.query.q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filters.$and = [
      ...(filters.$or ? [{ $or: filters.$or }] : []),
      { $or: [{ title: expression }, { summary: expression }, { body: expression }] },
    ];
    delete filters.$or;
  }
  const advisories = await Advisory.find(filters).sort({ createdAt: -1 }).limit(100);
  response.json({ success: true, data: advisories });
});

export const getAdvisory = asyncHandler(async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) throw new HttpError(404, 'Advisory not found');
  const advisory = await Advisory.findOne({ _id: request.params.id, published: true });
  if (!advisory) throw new HttpError(404, 'Advisory not found');
  response.json({ success: true, data: advisory });
});

export const createAdvisory = asyncHandler(async (request, response) => {
  const { title, category, crop, language, summary, body } = request.body;
  const advisory = await Advisory.create({
    title,
    category,
    crop: crop || null,
    language: language || 'en',
    summary,
    body,
    author: request.user.id,
  });
  response.status(201).json({ success: true, data: advisory });
});
