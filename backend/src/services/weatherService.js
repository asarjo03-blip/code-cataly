import { REGION_META, REGIONS } from '../config/constants.js';
import { env } from '../config/env.js';
import { getSeasonPhase } from '../utils/season.js';
import { HttpError } from '../utils/httpError.js';

const cache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

const CLIMATOLOGY = {
  rainy: {
    onset: { tempC: 29, humidity: 78, rainMm: 8, condition: 'Scattered thunderstorms', windKph: 14 },
    peak: { tempC: 28, humidity: 85, rainMm: 16, condition: 'Heavy showers', windKph: 16 },
    late: { tempC: 29, humidity: 80, rainMm: 7, condition: 'Occasional showers', windKph: 12 },
  },
  dry: {
    harvest: { tempC: 30, humidity: 48, rainMm: 0, condition: 'Mostly sunny', windKph: 12 },
    harmattan: { tempC: 27, humidity: 28, rainMm: 0, condition: 'Hazy / dusty', windKph: 18 },
    hot: { tempC: 34, humidity: 35, rainMm: 0, condition: 'Very hot and dry', windKph: 14 },
  },
};

function cacheKey(lat, lon) {
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

function fromCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.storedAt > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function toCache(key, value) {
  cache.set(key, { storedAt: Date.now(), value });
  return value;
}

export function resolveLocation({ region, lat, lon }) {
  if (lat !== undefined && lon !== undefined && lat !== '' && lon !== '') {
    const latitude = Number(lat);
    const longitude = Number(lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw new HttpError(400, 'lat and lon must be numbers');
    }
    return { region: region || null, lat: latitude, lon: longitude, label: 'Custom location' };
  }

  const regionKey = region && Object.values(REGIONS).includes(region) ? region : REGIONS.WEST_COAST;
  const meta = REGION_META[regionKey];
  return {
    region: regionKey,
    lat: meta.coordinates.lat,
    lon: meta.coordinates.lon,
    label: meta.label,
  };
}

function climatologySnapshot(location) {
  const phase = getSeasonPhase();
  const sample = CLIMATOLOGY[phase.season][phase.phase];
  return {
    source: 'gambia-climatology',
    location,
    current: {
      tempC: sample.tempC,
      humidity: sample.humidity,
      rainMm: sample.rainMm,
      windKph: sample.windKph,
      condition: sample.condition,
    },
    forecast: Array.from({ length: 5 }, (_item, index) => ({
      dayOffset: index + 1,
      tempC: sample.tempC + ((index % 2) - 0.5),
      rainMm: sample.rainMm,
      condition: sample.condition,
    })),
    season: phase,
    alerts: buildWeatherAlerts(sample, phase),
  };
}

function buildWeatherAlerts(current, phase) {
  const alerts = [];
  if (current.tempC >= 33) {
    alerts.push({
      severity: 'warning',
      code: 'heat',
      message: 'High heat stress risk for labour and leafy vegetables. Irrigate early morning or evening.',
    });
  }
  if (current.rainMm >= 12) {
    alerts.push({
      severity: 'warning',
      code: 'heavy_rain',
      message: 'Heavy rain likely. Delay spraying and nitrogen top-dress until fields drain.',
    });
  }
  if (phase.phase === 'harmattan') {
    alerts.push({
      severity: 'info',
      code: 'harmattan',
      message: 'Harmattan haze and dry winds. Mulch vegetables and watch for dust on solar pumps.',
    });
  }
  if (phase.phase === 'onset') {
    alerts.push({
      severity: 'info',
      code: 'sowing_window',
      message: 'Rainy season onset. Prepare seed, repair bunds, and sow after two reliable rain events.',
    });
  }
  return alerts;
}

async function fetchOpenWeather(location) {
  const query = new URLSearchParams({
    lat: String(location.lat),
    lon: String(location.lon),
    appid: env.openWeatherApiKey,
    units: 'metric',
  });

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}`),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error('OpenWeather request failed');
  }

  const currentJson = await currentRes.json();
  const forecastJson = await forecastRes.json();
  const phase = getSeasonPhase();
  const current = {
    tempC: currentJson.main?.temp,
    humidity: currentJson.main?.humidity,
    rainMm: currentJson.rain?.['1h'] || currentJson.rain?.['3h'] || 0,
    windKph: currentJson.wind?.speed ? Number((currentJson.wind.speed * 3.6).toFixed(1)) : 0,
    condition: currentJson.weather?.[0]?.description || 'unknown',
  };

  const byDay = new Map();
  for (const item of forecastJson.list || []) {
    const day = item.dt_txt.slice(0, 10);
    if (!byDay.has(day)) {
      byDay.set(day, {
        date: day,
        tempC: item.main?.temp,
        rainMm: item.rain?.['3h'] || 0,
        condition: item.weather?.[0]?.description || 'unknown',
      });
    }
  }

  return {
    source: 'openweathermap',
    location,
    current,
    forecast: [...byDay.values()].slice(0, 5).map((day, index) => ({
      dayOffset: index + 1,
      ...day,
    })),
    season: phase,
    alerts: buildWeatherAlerts(current, phase),
  };
}

export async function getWeather(params) {
  const location = resolveLocation(params);
  const key = cacheKey(location.lat, location.lon);
  const cached = fromCache(key);
  if (cached) {
    return { ...cached, cached: true };
  }

  if (!env.openWeatherApiKey) {
    return toCache(key, { ...climatologySnapshot(location), cached: false });
  }

  try {
    const live = await fetchOpenWeather(location);
    return toCache(key, { ...live, cached: false });
  } catch {
    return toCache(key, {
      ...climatologySnapshot(location),
      cached: false,
      fallbackReason: 'weather_provider_unavailable',
    });
  }
}
