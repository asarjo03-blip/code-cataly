import { Alert } from '../models/Alert.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listAlerts = asyncHandler(async (request, response) => {
  const filters = {};
  if (request.query.region) filters.region = request.query.region;
  const now = new Date();
  filters.$and = [
    { $or: [{ startsAt: { $exists: false } }, { startsAt: { $lte: now } }] },
    { $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gte: now } }] },
  ];
  const alerts = await Alert.find(filters).sort({ createdAt: -1 }).limit(50);
  response.json({ success: true, data: alerts });
});

export const createAlert = asyncHandler(async (request, response) => {
  const { type, severity, region, title, message, cropIds, startsAt, expiresAt } = request.body;
  const alert = await Alert.create({
    type,
    severity,
    region,
    title,
    message,
    cropIds: cropIds || [],
    startsAt,
    expiresAt,
    createdBy: request.user.id,
  });
  response.status(201).json({ success: true, data: alert });
});
