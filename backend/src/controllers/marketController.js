import { Market } from '../models/Market.js';
import { MarketPrice } from '../models/MarketPrice.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

async function pricesFor(filters = {}) {
  const match = {};
  if (filters.crop) match.crop = filters.crop;
  if (filters.marketId) match.marketId = filters.marketId;
  if (filters.region) {
    const markets = await Market.find({ region: filters.region }).select('slug');
    const regionMarketIds = markets.map((market) => market.slug);
    match.marketId = filters.marketId
      ? regionMarketIds.includes(filters.marketId)
        ? filters.marketId
        : { $in: [] }
      : { $in: regionMarketIds };
  }

  const [records, markets] = await Promise.all([
    MarketPrice.aggregate([
      { $match: match },
      { $sort: { recordedAt: -1 } },
      { $group: { _id: { crop: '$crop', marketId: '$marketId' }, record: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$record' } },
    ]),
    Market.find(match.marketId?.$in ? { slug: { $in: match.marketId.$in } } : {}),
  ]);
  const marketById = new Map(markets.map((market) => [market.slug, market.toJSON()]));
  return records
    .map((record) => {
      const price = { ...record };
      delete price._id;
      delete price.seedKey;
      delete price.__v;
      const previous = record.previousPrice;
      return {
        ...price,
        id: String(record._id),
        market: marketById.get(record.marketId),
        trend: record.pricePerKg > previous ? 'up' : record.pricePerKg < previous ? 'down' : 'flat',
        change: record.pricePerKg - previous,
      };
    })
    .filter((record) => record.market)
    .sort((a, b) => b.pricePerKg - a.pricePerKg);
}

export const listMarkets = asyncHandler(async (request, response) => {
  const filters = request.query.region ? { region: request.query.region } : {};
  const markets = await Market.find(filters).sort({ name: 1 });
  response.json({ success: true, data: markets });
});

export const getMarket = asyncHandler(async (request, response) => {
  const market = await Market.findOne({ slug: request.params.id });
  if (!market) throw new HttpError(404, 'Market not found');
  response.json({ success: true, data: market });
});

export const getPrices = asyncHandler(async (request, response) => {
  response.json({ success: true, data: await pricesFor(request.query) });
});

export const comparePrices = asyncHandler(async (request, response) => {
  const crop = request.query.crop;
  if (!crop) throw new HttpError(400, 'crop is required');
  const rows = await pricesFor({ crop });
  const best = rows[0];
  response.json({
    success: true,
    data: { crop, rows, bestMarket: best?.market, bestPrice: best?.pricePerKg },
  });
});

export const getPriceHistory = asyncHandler(async (request, response) => {
  const { crop, marketId } = request.query;
  if (!crop || !marketId) throw new HttpError(400, 'crop and marketId are required');
  const history = await MarketPrice.find({ crop, marketId })
    .sort({ recordedAt: -1 })
    .limit(7)
    .lean();
  response.json({
    success: true,
    data: history.reverse().map((entry, index) => ({
      day: `D-${history.length - 1 - index}`,
      price: entry.pricePerKg,
    })),
  });
});

export const submitPrice = asyncHandler(async (request, response) => {
  const { crop, marketId, pricePerKg, note } = request.body;
  const market = await Market.findOne({ slug: marketId });
  if (!market) throw new HttpError(400, 'Unknown market');
  const previous = await MarketPrice.findOne({ crop, marketId }).sort({ recordedAt: -1 });
  const price = await MarketPrice.create({
    crop,
    marketId,
    pricePerKg,
    previousPrice: previous?.pricePerKg ?? pricePerKg,
    note,
    source: request.user.name,
  });
  response.status(201).json({ success: true, data: price });
});
