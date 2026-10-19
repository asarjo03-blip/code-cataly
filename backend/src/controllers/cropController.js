import { Crop } from '../models/Crop.js';
import { currentActivities, getCropCalendar, monthInWindow } from '../data/cropCalendar.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

export const listCropsPublic = asyncHandler(async (_request, response) => {
  const crops = await Crop.find().sort({ name: 1 });
  response.json({ success: true, data: crops });
});

export const getCropCalendarHandler = asyncHandler(async (request, response) => {
  const crop = String(request.params.id || '').toLowerCase();
  const region = request.query.region;
  const entries = getCropCalendar(crop, region);
  if (!entries.length) {
    throw new HttpError(404, 'No calendar found for that crop');
  }
  const month = new Date().getMonth() + 1;
  response.json({
    success: true,
    data: {
      crop,
      region: region || null,
      month,
      activities: entries.map((entry) => ({
        ...entry,
        current: monthInWindow(month, entry.startMonth, entry.endMonth),
      })),
    },
  });
});

export const getCurrentCalendar = asyncHandler(async (request, response) => {
  const crops = [].concat(request.query.crop || request.query.crops || []).flatMap((value) => String(value).split(','));
  response.json({
    success: true,
    data: currentActivities(crops.filter(Boolean), undefined, request.query.region),
  });
});
