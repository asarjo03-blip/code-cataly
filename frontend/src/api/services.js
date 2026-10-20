import api, { hasDemoSession, withDemoFallback } from './client.js';
import { searchAdvisories, getAdvisory, saveAdvisory } from '../data/advisories.js';
import { currentActivities, getCropCalendar } from '../data/calendar.js';
import {
  listDemoUsers,
  loginDemoUser,
  registerDemoUser,
  updateDemoProfile,
  updateDemoRole,
} from '../data/demoUsers.js';
import { getLatestPrices, getMarket, MARKETS, priceHistorySeries } from '../data/markets.js';
import {
  deleteListing as deleteLocalListing,
  getListing,
  listBuyRequests,
  listListings,
  saveBuyRequest,
  saveListing,
} from '../data/listings.js';
import { readJson, writeJson } from '../utils/storage.js';

function getDemoPrices(filters = {}) {
  const rows = getLatestPrices(filters);
  const latestUpdates = new Map();
  for (const update of readJson('priceUpdates', [])) {
    const key = `${update.crop}-${update.marketId}`;
    if (!latestUpdates.has(key)) latestUpdates.set(key, update);
  }
  return rows
    .map((row) => {
      const update = latestUpdates.get(`${row.crop}-${row.marketId}`);
      if (!update) return row;
      const change = Number(update.pricePerKg) - row.pricePerKg;
      return {
        ...row,
        previous: row.pricePerKg,
        pricePerKg: Number(update.pricePerKg),
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
        change,
      };
    })
    .sort((a, b) => b.pricePerKg - a.pricePerKg);
}

function applyDemoListingPrivacy(listing) {
  const owner = listDemoUsers().find((user) => user.id === listing.ownerId);
  if (owner?.privacy?.showPhoneOnListings === false) {
    return { ...listing, farmerPhone: '' };
  }
  return listing;
}

function getDemoCompare(crop) {
  const rows = getDemoPrices({ crop });
  const best = rows[0];
  return { crop, rows, bestMarket: best?.market, bestPrice: best?.pricePerKg };
}

function getDemoPriceHistory({ crop, marketId }) {
  const history = priceHistorySeries(crop, marketId);
  const update = readJson('priceUpdates', []).find(
    (item) => item.crop === crop && item.marketId === marketId,
  );
  if (!update || !history.length) return history;
  return [...history.slice(1), { day: 'Today', price: Number(update.pricePerKg) }];
}

function getDemoAdvisories({ crop, category, q } = {}) {
  return searchAdvisories({ crop, category, q });
}

function getDemoWeather(region) {
  const today = new Date();
  const isRainySeason = today.getMonth() >= 5 && today.getMonth() <= 9;
  return {
    source: 'demo',
    location: { region },
    season: {
      season: isRainySeason ? 'rainy' : 'dry',
      phase: isRainySeason ? 'late' : 'dry',
    },
    current: {
      tempC: isRainySeason ? 29 : 33,
      rainMm: 0,
      condition: isRainySeason ? 'Partly cloudy' : 'Sunny',
    },
    forecast: Array.from({ length: 5 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index + 1);
      return {
        date: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString(undefined, { weekday: 'short' }),
        tempC: (isRainySeason ? 29 : 33) + (index % 2),
        rainMm: isRainySeason && index === 2 ? 4 : 0,
      };
    }),
    alerts: [],
  };
}

function getDemoMatches(user, crops) {
  if (!user || !['farmer', 'vendor'].includes(user.role)) return [];
  const listings = listListings();
  const requests = listBuyRequests();
  const pairs = [];

  if (user.role === 'farmer') {
    const availableListings = listings.filter((listing) => listing.ownerId === user.id);
    const listingPool = availableListings.length ? availableListings : listings;
    for (const request of requests) {
      if (crops.length && !crops.includes(request.crop)) continue;
      const listing = listingPool.find(
        (item) => item.crop === request.crop && (item.unit || 'kg') === (request.unit || 'kg'),
      );
      if (listing) pairs.push({ listing, request });
    }
  } else {
    const ownedRequests = requests.filter((item) => item.ownerId === user.id);
    const requestPool = ownedRequests.length ? ownedRequests : requests;
    for (const request of requestPool) {
      if (crops.length && !crops.includes(request.crop)) continue;
      const listing = listings.find(
        (item) => item.crop === request.crop && (item.unit || 'kg') === (request.unit || 'kg'),
      );
      if (listing) pairs.push({ listing, request });
    }
  }

  return pairs.slice(0, 5).map(({ listing, request }, index) => ({
    score: 75 - index,
    crop: listing.crop,
    listingId: listing.id,
    requestId: request.id,
    listing,
    request,
    reasons: ['Same crop and unit'],
  }));
}

function getDemoDashboard(user) {
  const crops = user?.crops || [];
  const weather = getDemoWeather(user?.region);
  const advisories = getDemoAdvisories()
    .filter((item) => !item.crop || !crops.length || crops.includes(item.crop))
    .slice(0, 6)
    .map((item) => ({ ...item, priority: 'info' }));
  const prices = getDemoPrices()
    .filter((item) => !crops.length || crops.includes(item.crop))
    .reduce((best, item) => {
      if (!best.has(item.crop)) best.set(item.crop, item);
      return best;
    }, new Map());
  const alerts = readJson('customAlerts', []).filter(
    (alert) => !user?.region || alert.region === user.region,
  );

  return {
    success: true,
    data: {
      farmer: user
        ? {
            name: user.name,
            region: user.region,
            village: user.village,
            crops,
            farmingType: user.farmingType,
          }
        : null,
      user,
      season: weather.season,
      weather,
      advice: advisories,
      calendar: currentActivities(crops),
      alerts,
      prices: [...prices.values()].map((row) => ({
        crop: row.crop,
        bestMarket: row.market?.name,
        marketId: row.marketId,
        pricePerKg: row.pricePerKg,
        trend: row.trend,
      })),
      matches: getDemoMatches(user, crops),
      crops,
      summary: {
        alertCount: alerts.length,
        urgentAdvice: 0,
        trackedCrops: crops.length,
      },
    },
  };
}

export const authApi = {
  register: (body) =>
    withDemoFallback(
      () => api.post('/auth/register', body).then((response) => response.data),
      () => registerDemoUser(body),
    ),
  login: (body) =>
    withDemoFallback(
      () => api.post('/auth/login', body).then((response) => response.data),
      () => loginDemoUser(body),
    ),
  me: () =>
    hasDemoSession()
      ? Promise.resolve({ success: true, data: { user: readJson('user', null) } })
      : withDemoFallback(
          () => api.get('/auth/me').then((response) => response.data),
          () => ({ success: true, data: { user: readJson('user', null) } }),
        ),
};

export const userApi = {
  getMe: () =>
    withDemoFallback(
      () => api.get('/users/me').then((response) => response.data),
      () => ({ success: true, data: { user: readJson('user', null) } }),
    ),
  updateMe: (body) =>
    withDemoFallback(
      () => api.patch('/users/me', body).then((response) => response.data),
      () => {
        const user = readJson('user', null);
        if (!user) throw new Error('Sign in to update your profile');
        const updatedUser = updateDemoProfile(user.id, body);
        writeJson('user', updatedUser);
        return { success: true, data: { user: updatedUser } };
      },
    ),
  listUsers: (params) =>
    withDemoFallback(
      () => api.get('/users', { params }).then((response) => response.data),
      () => {
        let users = listDemoUsers();
        if (params?.role) users = users.filter((user) => user.role === params.role);
        if (params?.region) users = users.filter((user) => user.region === params.region);
        return { success: true, data: { users } };
      },
    ),
  updateRole: (id, role) =>
    withDemoFallback(
      () => api.patch(`/users/${id}/role`, { role }).then((response) => response.data),
      () => ({ success: true, data: { user: updateDemoRole(id, role) } }),
    ),
};

export const dashboardApi = {
  get: (user = readJson('user', null)) =>
    withDemoFallback(
      () => api.get('/dashboard').then((response) => response.data),
      () => getDemoDashboard(user),
    ),
};

export const weatherApi = {
  get: (params = {}) =>
    withDemoFallback(
      () => api.get('/weather', { params }).then((response) => response.data),
      () => ({ success: true, data: getDemoWeather(params.region || readJson('user', null)?.region) }),
    ),
};

export const adviceApi = {
  get: (params = {}) =>
    withDemoFallback(
      () => api.get('/advice', { params }).then((response) => response.data),
      () => ({
        success: true,
        data: getDemoAdvisories(params).map((item) => ({ ...item, priority: 'info' })),
      }),
    ),
  crops: () =>
    withDemoFallback(
      () => api.get('/advice/crops').then((response) => response.data),
      () => ({ success: true, data: [] }),
    ),
};

export const marketApi = {
  list: (params = {}) =>
    withDemoFallback(
      () => api.get('/markets', { params }).then((response) => response.data),
      () => ({
        success: true,
        data: params.region ? MARKETS.filter((market) => market.region === params.region) : MARKETS,
      }),
    ),
  get: (id) =>
    withDemoFallback(
      () => api.get(`/markets/${id}`).then((response) => response.data),
      () => ({ success: true, data: getMarket(id) }),
    ),
  prices: (params = {}) =>
    withDemoFallback(
      () => api.get('/markets/prices', { params }).then((response) => response.data),
      () => ({ success: true, data: getDemoPrices(params) }),
    ),
  compare: (crop) =>
    withDemoFallback(
      () => api.get('/markets/compare', { params: { crop } }).then((response) => response.data),
      () => ({ success: true, data: getDemoCompare(crop) }),
    ),
  history: (params) =>
    withDemoFallback(
      () => api.get('/markets/history', { params }).then((response) => response.data),
      () => ({ success: true, data: getDemoPriceHistory(params) }),
    ),
  submitPrice: (payload) =>
    withDemoFallback(
      () => api.post('/markets/prices', payload).then((response) => response.data),
      () => {
        const updates = readJson('priceUpdates', []);
        const current = getDemoPrices({ crop: payload.crop, marketId: payload.marketId })[0];
        const price = {
          ...payload,
          pricePerKg: Number(payload.pricePerKg),
          previous: current?.pricePerKg ?? Number(payload.pricePerKg),
          id: `pu-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        updates.unshift(price);
        writeJson('priceUpdates', updates);
        return { success: true, data: price };
      },
    ),
};

export const listingApi = {
  list: (params = {}) =>
    withDemoFallback(
      () =>
        api
          .get(params.mine ? '/listings/mine' : '/listings', { params })
          .then((response) => response.data),
      () => ({
        success: true,
        data: listListings(params.mine ? { ...params, includeAll: true } : params)
          .map((listing) => (params.mine ? listing : applyDemoListingPrivacy(listing))),
      }),
    ),
  get: (id) =>
    withDemoFallback(
      () => api.get(`/listings/${id}`).then((response) => response.data),
      () => ({ success: true, data: applyDemoListingPrivacy(getListing(id)) }),
    ),
  create: (payload) =>
    withDemoFallback(
      () => api.post('/listings', payload).then((response) => response.data),
      () => {
        const listing = {
          id: `lst-${Date.now()}`,
          category: 'crop',
          status: 'open',
          availableFrom: new Date().toISOString().slice(0, 10),
          ...payload,
        };
        return { success: true, data: saveListing(listing) };
      },
    ),
  update: (id, payload) =>
    withDemoFallback(
      () => api.patch(`/listings/${id}`, payload).then((response) => response.data),
      () => {
        const existing = getListing(id);
        if (!existing) throw new Error('Listing not found');
        return { success: true, data: saveListing({ ...existing, ...payload, id }) };
      },
    ),
  remove: (id) =>
    withDemoFallback(
      () => api.delete(`/listings/${id}`).then((response) => response.data),
      () => {
        deleteLocalListing(id);
        return { success: true };
      },
    ),
};

export const buyRequestApi = {
  list: (params = {}) =>
    withDemoFallback(
      () =>
        api
          .get(params.mine ? '/buy-requests/mine' : '/buy-requests', { params })
          .then((response) => response.data),
      () => ({
        success: true,
        data: listBuyRequests(params.mine ? { ...params, includeAll: true } : params),
      }),
    ),
  create: (payload) =>
    withDemoFallback(
      () => api.post('/buy-requests', payload).then((response) => response.data),
      () => {
        const request = {
          id: `br-${Date.now()}`,
          category: 'crop',
          status: 'open',
          neededBy: new Date().toISOString().slice(0, 10),
          ...payload,
        };
        return { success: true, data: saveBuyRequest(request) };
      },
    ),
};

export const advisoryApi = {
  list: (params = {}) =>
    withDemoFallback(
      () => api.get('/advisories', { params }).then((response) => response.data),
      () => ({ success: true, data: getDemoAdvisories(params) }),
    ),
  get: (id) =>
    withDemoFallback(
      () => api.get(`/advisories/${id}`).then((response) => response.data),
      () => ({ success: true, data: getAdvisory(id) }),
    ),
  create: (payload) =>
    withDemoFallback(
      () => api.post('/advisories', payload).then((response) => response.data),
      () => {
        const item = { id: `adv-custom-${Date.now()}`, language: 'en', ...payload };
        return { success: true, data: saveAdvisory(item) };
      },
    ),
};

export const calendarApi = {
  forCrop: async (crop) => ({ success: true, data: getCropCalendar(crop) }),
  current: async (crops) => ({ success: true, data: currentActivities(crops) }),
};

export const alertApi = {
  list: (params = {}) =>
    withDemoFallback(
      () => api.get('/alerts', { params }).then((response) => response.data),
      () => ({
        success: true,
        data: readJson('customAlerts', []).filter((alert) => !params.region || alert.region === params.region),
      }),
    ),
  create: (payload) =>
    withDemoFallback(
      () => api.post('/alerts', payload).then((response) => response.data),
      () => {
        const alerts = readJson('customAlerts', []);
        const alert = { id: `al-${Date.now()}`, createdAt: new Date().toISOString(), ...payload };
        alerts.unshift(alert);
        writeJson('customAlerts', alerts);
        return { success: true, data: alert };
      },
    ),
};
