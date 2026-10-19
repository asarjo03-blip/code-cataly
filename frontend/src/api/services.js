import api, { withDemoFallback } from './client.js';
import { searchAdvisories, getAdvisory, saveAdvisory } from '../data/advisories.js';
import { currentActivities, getCropCalendar } from '../data/calendar.js';
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

export const authApi = {
  register: (body) => api.post('/auth/register', body).then((r) => r.data),
  login: (body) => api.post('/auth/login', body).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export const userApi = {
  getMe: () => api.get('/users/me').then((r) => r.data),
  updateMe: (body) => api.patch('/users/me', body).then((r) => r.data),
  listUsers: (params) => api.get('/users', { params }).then((r) => r.data),
};

export const dashboardApi = {
  get: () =>
    withDemoFallback(
      () => api.get('/dashboard').then((response) => response.data),
      () => ({
        success: true,
        data: {
          weather: { current: null, forecast: [], alerts: [] },
          advice: getDemoAdvisories().slice(0, 4).map((item) => ({
            ...item,
            priority: 'info',
          })),
          crops: [],
          summary: { alertCount: 0, urgentAdvice: 0, trackedCrops: 0 },
        },
      }),
    ),
};

export const weatherApi = {
  get: (params) => api.get('/weather', { params }).then((r) => r.data),
};

export const adviceApi = {
  get: (params) => api.get('/advice', { params }).then((r) => r.data),
  crops: () => api.get('/advice/crops').then((r) => r.data),
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
        data: listListings(params.mine ? { ...params, includeAll: true } : params),
      }),
    ),
  get: (id) =>
    withDemoFallback(
      () => api.get(`/listings/${id}`).then((response) => response.data),
      () => ({ success: true, data: getListing(id) }),
    ),
  create: (payload) =>
    withDemoFallback(
      () => api.post('/listings', payload).then((response) => response.data),
      () => {
        const listing = {
          id: `lst-${Date.now()}`,
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
