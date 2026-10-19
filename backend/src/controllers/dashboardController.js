import { REGION_META } from '../config/constants.js';
import { Crop } from '../models/Crop.js';
import { generateAdvice } from '../services/adviceEngine.js';
import { getWeather } from '../services/weatherService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (request, response) => {
  const user = request.user.toJSON();
  const weather = await getWeather({ region: user.region });
  const advice = generateAdvice({
    region: user.region,
    crops: user.crops,
    weather,
  });
  const crops = await Crop.find(user.crops?.length ? { slug: { $in: user.crops } } : {}).limit(12);

  response.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        region: user.region,
        regionLabel: REGION_META[user.region]?.label,
        village: user.village,
        crops: user.crops,
      },
      season: weather.season,
      weather: {
        source: weather.source,
        current: weather.current,
        forecast: weather.forecast,
        alerts: weather.alerts,
        location: weather.location,
      },
      advice: advice.slice(0, 6),
      crops,
      summary: {
        alertCount: weather.alerts.length,
        urgentAdvice: advice.filter((item) => item.priority === 'urgent').length,
        trackedCrops: user.crops?.length || 0,
      },
    },
  });
});
