import { REGION_META, REGIONS } from '../config/constants.js';
import { getSeasonPhase } from '../utils/season.js';
import { HttpError } from '../utils/httpError.js';

const cache = new Map();
const CACHE_TTL_MS = 45 * 60 * 1000;

const WMO_LABELS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Light snow',
  80: 'Rain showers',
  81: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
};

const CLIMATOLOGY = {
  rainy: {
    onset: { tempC: 29, humidity: 78, rainMm: 8, condition: 'Scattered thunderstorms', windKph: 14, code: 80 },
    peak: { tempC: 28, humidity: 85, rainMm: 16, condition: 'Heavy showers', windKph: 16, code: 81 },
    late: { tempC: 29, humidity: 80, rainMm: 7, condition: 'Occasional showers', windKph: 12, code: 61 },
  },
  dry: {
    harvest: { tempC: 30, humidity: 48, rainMm: 0, condition: 'Mostly sunny', windKph: 12, code: 1 },
    harmattan: { tempC: 27, humidity: 28, rainMm: 0, condition: 'Hazy / dusty', windKph: 18, code: 45 },
    hot: { tempC: 34, humidity: 35, rainMm: 0, condition: 'Very hot and dry', windKph: 14, code: 0 },
  },
};

const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function compassFromDegrees(degrees) {
  const value = Number(degrees);
  if (degrees === null || degrees === undefined || Number.isNaN(value)) return null;
  return COMPASS_POINTS[Math.round((((value % 360) + 360) % 360) / 45) % 8];
}

function clockTime(value) {
  if (!value) return null;
  const time = String(value).split('T')[1];
  return time ? time.slice(0, 5) : null;
}

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
  const windDirDeg = phase.season === 'rainy' ? 225 : 60;
  const current = {
    tempC: sample.tempC,
    feelsLikeC: sample.tempC + (sample.humidity >= 70 ? 4 : 1),
    humidity: sample.humidity,
    rainMm: sample.rainMm,
    rainChance: sample.rainMm > 0 ? Math.min(95, 40 + sample.rainMm * 3) : 8,
    windKph: sample.windKph,
    windDirDeg,
    windDir: compassFromDegrees(windDirDeg),
    isDay: true,
    uvIndex: phase.season === 'rainy' ? 6 : 8,
    highTempC: sample.tempC + 4,
    lowTempC: sample.tempC - 6,
    sunrise: '07:00',
    sunset: '18:30',
    condition: sample.condition,
    code: sample.code,
  };

  return {
    source: 'gambia-climatology',
    location,
    updatedAt: new Date().toISOString(),
    current,
    forecast: Array.from({ length: 5 }, (_item, index) => {
      const date = new Date(Date.now() + (index + 1) * 86400000);
      const maxTempC = sample.tempC + 1 + (index % 2);
      return {
        dayOffset: index + 1,
        date: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString('en-GB', { weekday: 'short' }),
        tempC: maxTempC,
        maxTempC,
        minTempC: maxTempC - 8,
        rainMm: sample.rainMm,
        rainChance: current.rainChance,
        windKph: sample.windKph,
        uvIndexMax: current.uvIndex,
        condition: sample.condition,
        code: sample.code,
      };
    }),
    season: phase,
    alerts: buildWeatherAlerts(current, phase),
  };
}

function buildWeatherAlerts(current, phase) {
  const alerts = [];
  const heatTemp = current.highTempC ?? current.tempC;
  if (heatTemp >= 33) {
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

function describeCode(code) {
  return WMO_LABELS[code] || 'Mixed conditions';
}

async function fetchOpenMeteo(location) {
  const query = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset',
    forecast_days: '6',
    timezone: 'Africa/Banjul',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`);
  if (!response.ok) throw new Error('Open-Meteo request failed');
  const json = await response.json();
  const phase = getSeasonPhase();
  const currentCode = json.current?.weather_code;
  const windDirDeg = json.current?.wind_direction_10m;
  const current = {
    tempC: json.current?.temperature_2m,
    feelsLikeC: json.current?.apparent_temperature,
    humidity: json.current?.relative_humidity_2m,
    rainMm: json.current?.precipitation || 0,
    rainChance: json.daily?.precipitation_probability_max?.[0] ?? (json.current?.precipitation > 0 ? 60 : 10),
    windKph: json.current?.wind_speed_10m || 0,
    windDirDeg,
    windDir: compassFromDegrees(windDirDeg),
    isDay: Boolean(json.current?.is_day),
    uvIndex: json.daily?.uv_index_max?.[0] ?? null,
    highTempC: json.daily?.temperature_2m_max?.[0] ?? null,
    lowTempC: json.daily?.temperature_2m_min?.[0] ?? null,
    sunrise: clockTime(json.daily?.sunrise?.[0]),
    sunset: clockTime(json.daily?.sunset?.[0]),
    condition: describeCode(currentCode),
    code: currentCode,
  };

  const forecast = (json.daily?.time || []).slice(1, 6).map((date, index) => {
    const code = json.daily.weather_code?.[index + 1];
    const maxTempC = json.daily.temperature_2m_max?.[index + 1];
    return {
      dayOffset: index + 1,
      date,
      label: new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short' }),
      tempC: maxTempC,
      maxTempC,
      minTempC: json.daily.temperature_2m_min?.[index + 1] ?? null,
      rainMm: json.daily.precipitation_sum?.[index + 1] || 0,
      rainChance: json.daily.precipitation_probability_max?.[index + 1] ?? 0,
      windKph: json.daily.wind_speed_10m_max?.[index + 1] ?? null,
      uvIndexMax: json.daily.uv_index_max?.[index + 1] ?? null,
      sunrise: clockTime(json.daily.sunrise?.[index + 1]),
      sunset: clockTime(json.daily.sunset?.[index + 1]),
      condition: describeCode(code),
      code,
    };
  });

  return {
    source: 'open-meteo',
    location,
    updatedAt: new Date().toISOString(),
    current,
    forecast,
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

  try {
    const live = await fetchOpenMeteo(location);
    return toCache(key, { ...live, cached: false });
  } catch {
    return toCache(key, {
      ...climatologySnapshot(location),
      cached: false,
      fallbackReason: 'weather_provider_unavailable',
    });
  }
}
