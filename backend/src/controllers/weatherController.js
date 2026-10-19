import { getWeather } from '../services/weatherService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCurrentWeather = asyncHandler(async (request, response) => {
  const weather = await getWeather({
    region: request.query.region || request.user.region,
    lat: request.query.lat,
    lon: request.query.lon,
  });
  response.json({ success: true, data: { weather } });
});
