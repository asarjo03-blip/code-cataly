import { readJson, writeJson } from '../utils/storage.js';

export const ADVISORIES = [
  {
    id: 'adv-1',
    title: 'Aphids on tomato and cabbage',
    category: 'pest',
    crop: 'tomato',
    language: 'en',
    summary: 'Watch undersides of leaves in cool dry months.',
    body: 'Aphids cluster on young shoots and leaf undersides. Wash with soapy water early, encourage ladybirds, and avoid unnecessary broad-spectrum sprays. Remove heavily infested shoots and keep beds weed-free.',
  },
  {
    id: 'adv-2',
    title: 'Groundnut leaf spot',
    category: 'disease',
    crop: 'groundnut',
    language: 'en',
    summary: 'Brown spots can cut yield late in the rains.',
    body: 'Early and late leaf spot show as brown spots with yellow halos. Use certified seed, rotate fields, space plants for airflow, and harvest promptly once pods mature. Do not store wet haulms with pods.',
  },
  {
    id: 'adv-3',
    title: 'Safe groundnut drying to limit aflatoxin',
    category: 'storage',
    crop: 'groundnut',
    language: 'en',
    summary: 'Dry off the soil and reject mouldy pods.',
    body: 'Spread pods on clean tarpaulins raised off bare earth. Dry to a crisp snap before bagging. Sort out damaged or mouldy nuts. Store in cool, dry, ventilated rooms on pallets — never on damp floors.',
  },
  {
    id: 'adv-4',
    title: 'Building soil with compost and manure',
    category: 'soil',
    crop: null,
    language: 'en',
    summary: 'Improve sandy uplands before planting.',
    body: 'Mix well-rotted manure or compost into planting hills. Mulch after establishment to hold moisture. Avoid burning crop residues where possible — return them to the soil or use as livestock bedding then compost.',
  },
  {
    id: 'adv-5',
    title: 'Rice blast watch in humid spells',
    category: 'disease',
    crop: 'rice',
    language: 'en',
    summary: 'Diamond lesions on leaves after long wet periods.',
    body: 'Avoid excessive nitrogen early. Keep balanced water, remove infected debris, and plant resistant varieties when available. Report severe outbreaks to your extension officer.',
  },
  {
    id: 'adv-6',
    title: 'Fruit fly management for mango',
    category: 'pest',
    crop: 'mango',
    language: 'en',
    summary: 'Protect ripening fruit from puncture damage.',
    body: 'Collect and bury fallen fruit. Harvest at the right maturity, use traps where available, and avoid leaving overripe fruit under trees. Clean packing areas to stop breeding.',
  },
  {
    id: 'adv-7',
    title: 'Onion storage after harvest',
    category: 'storage',
    crop: 'onion',
    language: 'en',
    summary: 'Cure bulbs before long storage.',
    body: 'Cure onions in a shaded, airy place until necks are dry and skins rustle. Store in mesh bags or on racks, keep dry, and check weekly for soft bulbs.',
  },
  {
    id: 'adv-8',
    title: 'Best practice: planting with the rains',
    category: 'general',
    crop: null,
    language: 'en',
    summary: 'Wait for two soaking rains before sowing rain-fed crops.',
    body: 'Dry planting wastes seed on sandy soils. After the first reliable rains, prepare land quickly and sow certified seed. Keep a small nursery of vegetables ready for transplant once beds hold moisture.',
  },
];

export const ADVISORY_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'pest', label: 'Pests' },
  { id: 'disease', label: 'Diseases' },
  { id: 'soil', label: 'Soil' },
  { id: 'storage', label: 'Storage' },
  { id: 'general', label: 'Best practice' },
];

export function searchAdvisories({ crop, category, q } = {}) {
  let items = [...readJson('customAdvisories', []), ...ADVISORIES];
  if (category && category !== 'all') items = items.filter((a) => a.category === category);
  if (crop) items = items.filter((a) => !a.crop || a.crop === crop);
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter(
      (a) =>
        a.title.toLowerCase().includes(needle) ||
        a.summary.toLowerCase().includes(needle) ||
        a.body.toLowerCase().includes(needle),
    );
  }
  return items;
}

export function getAdvisory(id) {
  return [...readJson('customAdvisories', []), ...ADVISORIES].find((a) => a.id === id);
}

export function saveAdvisory(advisory) {
  const items = readJson('customAdvisories', []);
  items.unshift(advisory);
  writeJson('customAdvisories', items);
  return advisory;
}
