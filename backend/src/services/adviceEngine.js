import { ADVICE_THRESHOLDS } from '../config/adviceThresholds.js';
import { REGION_META } from '../config/constants.js';
import { ACTIVITY_LABELS, currentActivities } from '../data/cropCalendar.js';
import { CROP_KNOWLEDGE, findCrop, normalizeCrops } from './cropKnowledge.js';
import { getSeasonPhase } from '../utils/season.js';

function priorityScore(item) {
  const weights = { urgent: 3, seasonal: 2, general: 1 };
  return weights[item.priority] || 0;
}

function cropAdvice(crop, context) {
  const items = [];
  const { season, phase } = context.season;
  const rain = context.weather?.current?.rainMm || 0;
  const temp = context.weather?.current?.tempC || 0;
  const dryDays = (context.weather?.forecast || []).filter((day) => (day.rainMm || 0) < 1).length;
  const harvestRainDays = (context.weather?.forecast || []).filter((day) => (day.rainMm || 0) >= ADVICE_THRESHOLDS.heavyRainMm).length;

  if (crop.slug === 'groundnut') {
    if (phase === 'onset') {
      items.push({
        title: 'Sow groundnut after reliable rains',
        body: 'Plant certified seed 5–8 cm deep once two soaking rains have arrived. Avoid dry planting on sandy uplands.',
        priority: 'urgent',
      });
    }
    if (phase === 'late' || phase === 'harvest') {
      items.push({
        title: 'Dry and store groundnut to limit aflatoxin',
        body: 'Lift promptly, dry on tarpaulins off the soil, and reject mouldy pods before storage or sale.',
        priority: 'urgent',
      });
    }
  }

  if (crop.slug === 'rice') {
    if (season === 'rainy') {
      items.push({
        title: 'Maintain rice bunds and drainage',
        body: 'Repair bunds in tidal and lowland plots. Keep water 3–5 cm after transplanting, then drain briefly before fertiliser.',
        priority: 'seasonal',
      });
    }
    if (season === 'dry') {
      items.push({
        title: 'Irrigate dry-season rice on a schedule',
        body: 'Only plant irrigated rice where pumps and fuel or solar power are reliable. Stress at panicle initiation cuts yield.',
        priority: 'seasonal',
      });
    }
  }

  if (['onion', 'tomato', 'cabbage'].includes(crop.slug)) {
    if (season === 'dry') {
      items.push({
        title: `Irrigate ${crop.name.toLowerCase()} in the cool hours`,
        body: 'Water at dawn or dusk. Mulch beds to keep soil moisture during harmattan winds and reduce weed pressure.',
        priority: 'seasonal',
      });
    } else {
      items.push({
        title: `Protect ${crop.name.toLowerCase()} from excess rain`,
        body: 'Raise beds and consider a simple rain shelter. Wet leaves raise blight and bacterial-spot risk.',
        priority: 'seasonal',
      });
    }
  }

  if (crop.slug === 'millet' || crop.slug === 'sorghum' || crop.slug === 'maize') {
    if (phase === 'onset' || phase === 'peak') {
      items.push({
        title: `Weed ${crop.name.toLowerCase()} early`,
        body: 'First weeding within 2–3 weeks of emergence. Side-dress nitrogen after rains when plants are knee-high.',
        priority: 'seasonal',
      });
    }
  }

  if (crop.slug === 'cashew' && (phase === 'harmattan' || phase === 'hot')) {
    items.push({
      title: 'Keep firebreaks around cashew orchards',
      body: 'Clear undergrowth before the hottest months. Bush fires are a leading cause of orchard loss in the dry season.',
      priority: 'urgent',
    });
  }

  if (context.farmingType === 'rainfed' && dryDays >= ADVICE_THRESHOLDS.drySpellDays) {
    items.push({
      title: `Protect rain-fed ${crop.name.toLowerCase()} through a dry spell`,
      body: 'Mulch, delay further sowing, and water nurseries if you can. Rain-fed fields dry quickly on sandy uplands.',
      priority: 'urgent',
    });
  }

  if (harvestRainDays >= ADVICE_THRESHOLDS.harvestRainDays) {
    items.push({
      title: `Cover or harvest ${crop.name.toLowerCase()} before heavy rain`,
      body: 'Several wet days are forecast. Harvest early if produce is mature, or cover drying groundnuts and grain.',
      priority: 'urgent',
    });
  }

  if (rain >= ADVICE_THRESHOLDS.heavyRainMm) {
    items.push({
      title: `Pause spraying on ${crop.name.toLowerCase()}`,
      body: 'Wait until foliage dries. Rain washes pesticide and foliar feeds off the leaf.',
      priority: 'urgent',
    });
  }

  if (temp >= ADVICE_THRESHOLDS.heatTempC && crop.category === 'horticulture') {
    items.push({
      title: `Shade ${crop.name.toLowerCase()} during peak heat`,
      body: 'Use 30–40% shade net or intercrop tall millet on bed edges to reduce blossom drop.',
      priority: 'urgent',
    });
  }

  if (items.length === 0) {
    items.push({
      title: `${crop.name}: follow the ${season} calendar`,
      body: crop.notes,
      priority: 'general',
    });
  }

  return items.map((item) => ({
    ...item,
    crop: crop.slug,
    region: context.region,
    tags: [season, phase, crop.category],
  }));
}

export function generateAdvice({ region, crops = [], weather, date, farmingType = 'rainfed' } = {}) {
  const season = getSeasonPhase(date);
  const regionLabel = REGION_META[region]?.label || region || 'The Gambia';
  const selected = normalizeCrops(crops);
  const cropRecords = (selected.length > 0 ? selected : CROP_KNOWLEDGE.map((crop) => crop.slug))
    .map((slug) => findCrop(slug))
    .filter(Boolean)
    .filter((crop) => selected.length > 0 || !region || crop.regions.includes(region));

  const context = { region, season, weather, farmingType };
  const items = [];

  for (const activity of currentActivities(selected.length ? selected : [], undefined, region)) {
    items.push({
      title: `${ACTIVITY_LABELS[activity.activity] || activity.activity} window for ${activity.crop}`,
      body: activity.notes,
      priority: activity.activity === 'plant' || activity.activity === 'harvest' ? 'seasonal' : 'general',
      crop: activity.crop,
      region,
      tags: [activity.activity, 'calendar'],
    });
  }

  items.push({
    title: `${season.label} in ${regionLabel}`,
    body:
      season.season === 'rainy'
        ? 'Focus on sowing, weeding, and drainage. Watch for armyworm after flushes of rain and keep seed stores dry.'
        : 'Focus on irrigated horticulture, harvest, storage, and bushfire prevention. Livestock need extra water points.',
    priority: 'seasonal',
    crop: null,
    region,
    tags: [season.season, season.phase, 'calendar'],
  });

  for (const crop of cropRecords.slice(0, 8)) {
    items.push(...cropAdvice(crop, context));
  }

  for (const alert of weather?.alerts || []) {
    items.unshift({
      title: alert.message,
      body: 'Generated from current weather for your location.',
      priority: alert.severity === 'warning' ? 'urgent' : 'seasonal',
      crop: null,
      region,
      tags: [alert.code, 'weather'],
    });
  }

  const seen = new Set();
  return items
    .filter((item) => {
      const key = `${item.title}:${item.crop || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .slice(0, 12);
}

export function listCrops() {
  return CROP_KNOWLEDGE;
}
