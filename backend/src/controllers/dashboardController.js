import { REGION_META } from '../config/constants.js';
import { Alert } from '../models/Alert.js';
import { BuyRequest } from '../models/BuyRequest.js';
import { Crop } from '../models/Crop.js';
import { Listing } from '../models/Listing.js';
import { currentActivities } from '../data/cropCalendar.js';
import { generateAdvice } from '../services/adviceEngine.js';
import { rankMatches } from '../services/matchingService.js';
import { getWeather } from '../services/weatherService.js';
import { pricesFor } from './marketController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (request, response) => {
  const user = request.user.toJSON();
  const weather = await getWeather({ region: user.region });
  const cropSet = user.crops || [];
  const [advice, crops, prices, listings, requests, alerts] = await Promise.all([
    Promise.resolve(
      generateAdvice({
        region: user.region,
        crops: cropSet,
        weather,
        farmingType: user.farmingType,
      }),
    ),
    Crop.find(cropSet.length ? { slug: { $in: cropSet } } : {}).limit(12),
    pricesFor(cropSet.length ? {} : {}),
    Listing.find({ status: 'open' }).limit(80),
    BuyRequest.find({ status: 'open' }).limit(80),
    Alert.find({ region: user.region }).sort({ createdAt: -1 }).limit(8),
  ]);

  const myPrices = prices.filter((row) => cropSet.includes(row.crop));
  const bestByCrop = [];
  for (const crop of cropSet) {
    const cropRows = prices.filter((row) => row.crop === crop);
    if (cropRows[0]) {
      bestByCrop.push({
        crop,
        bestMarket: cropRows[0].market?.name,
        marketId: cropRows[0].marketId,
        pricePerKg: cropRows[0].pricePerKg,
        trend: cropRows[0].trend,
      });
    }
  }

  const listingRecords = listings.map((item) => item.toJSON());
  const requestRecords = requests.map((item) => item.toJSON());
  const matches =
    user.role === 'farmer'
      ? rankMatches({
          listings: listingRecords.filter((listing) => listing.ownerId === user.id),
          requests: requestRecords,
          region: user.region,
        })
      : user.role === 'vendor'
        ? rankMatches({
            listings: listingRecords,
            requests: requestRecords.filter((buyRequest) => buyRequest.ownerId === user.id),
            region: user.region,
          })
        : [];
  const userMatches = matches
    .filter((match) => !cropSet.length || cropSet.includes(match.crop))
    .slice(0, 5);

  response.json({
    success: true,
    data: {
      farmer: {
        name: user.name,
        region: user.region,
        regionLabel: REGION_META[user.region]?.label,
        village: user.village,
        crops: user.crops,
        farmingType: user.farmingType,
      },
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
      calendar: currentActivities(cropSet, undefined, user.region),
      alerts: alerts.map((item) => item.toJSON()),
      prices: bestByCrop.length ? bestByCrop : myPrices.slice(0, 4),
      matches: userMatches,
      crops,
      summary: {
        alertCount: weather.alerts.length + alerts.length,
        urgentAdvice: advice.filter((item) => item.priority === 'urgent').length,
        trackedCrops: user.crops?.length || 0,
      },
    },
  });
});
