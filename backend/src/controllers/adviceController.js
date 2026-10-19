import { generateAdvice, listCrops } from '../services/adviceEngine.js';
import { getWeather } from '../services/weatherService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdvice = asyncHandler(async (request, response) => {
  const region = request.query.region || request.user.region;
  const crops = request.query.crop
    ? [].concat(request.query.crop)
    : request.user.crops || [];
  const weather = await getWeather({ region });
  const advice = generateAdvice({ region, crops, weather });
  response.json({ success: true, data: { advice, season: weather.season } });
});

export const generateAdviceHandler = asyncHandler(async (request, response) => {
  const region = request.body.region || request.user.region;
  const crops = request.body.crops || request.user.crops || [];
  const weather = await getWeather({
    region,
    lat: request.body.lat,
    lon: request.body.lon,
  });
  const advice = generateAdvice({ region, crops, weather });
  response.json({ success: true, data: { advice, weather, season: weather.season } });
});

export const getCrops = asyncHandler(async (_request, response) => {
  response.json({ success: true, data: { crops: listCrops() } });
});
