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
  {
    id: 'adv-9',
    title: 'Pick okra every two to three days',
    category: 'general',
    crop: 'okra',
    language: 'en',
    summary: 'Regular picking keeps plants productive.',
    body: 'Harvest tender pods while they snap easily. Leaving pods on the plant stops new flowers and makes pods fibrous. Wear gloves and long sleeves because okra leaves can irritate skin.',
  },
  {
    id: 'adv-10',
    title: 'Okra yellow mosaic and whitefly',
    category: 'disease',
    crop: 'okra',
    language: 'en',
    summary: 'Yellow mottled leaves point to virus spread by whitefly.',
    body: 'Remove infected plants early and control whitefly with soapy water or recommended products. Keep weeds and old crop debris down. Rotate away from okra and other malvaceous crops for at least two seasons.',
  },
  {
    id: 'adv-11',
    title: 'Thrips and flower drop in chilli',
    category: 'pest',
    crop: 'pepper',
    language: 'en',
    summary: 'Curled leaves and scarred fruit signal thrips.',
    body: 'Inspect flowers and young leaves early in the morning. Use blue sticky traps where available, remove heavily infested shoots, and avoid over-fertilising with nitrogen. Keep plants well watered but not waterlogged.',
  },
  {
    id: 'adv-12',
    title: 'Sweet potato weevil and curing',
    category: 'storage',
    crop: 'sweet_potato',
    language: 'en',
    summary: 'Cure roots before storage and reject damaged ones.',
    body: 'Lift roots carefully to avoid cuts. Cure in a shaded, ventilated place for a few days, then store in a cool dry room. Remove roots with holes or rot. Rotate fields and avoid planting infected vines.',
  },
  {
    id: 'adv-13',
    title: 'Harvest sesame before capsules shatter',
    category: 'storage',
    crop: 'sesame',
    language: 'en',
    summary: 'Timing protects the seed from loss.',
    body: 'Cut plants when lower capsules turn brown but before they open fully. Bundle and dry upright on a tarpaulin, then shake seed out. Dry seed well before bagging and store away from damp floors.',
  },
  {
    id: 'adv-14',
    title: 'Protect cowpea from storage weevils',
    category: 'storage',
    crop: 'cowpea',
    language: 'en',
    summary: 'Bruchids can destroy a store in weeks.',
    body: 'Dry cowpea to low moisture, remove damaged grains, and store in clean sealed containers. Inspect monthly. Where available, use approved hermetic storage bags or a recommended protectant according to label directions.',
  },
  {
    id: 'adv-15',
    title: 'Watermelon ripening and fruit fly',
    category: 'general',
    crop: 'watermelon',
    language: 'en',
    summary: 'Reduce water at ripening and protect fruit.',
    body: 'Stop overhead irrigation as fruit ripens to improve sweetness and reduce splitting. Place fruit on dry straw or a clean board. Collect fallen or damaged fruit to reduce fruit-fly breeding.',
  },
  {
    id: 'adv-16',
    title: 'Papaya roots need good drainage',
    category: 'disease',
    crop: 'papaya',
    language: 'en',
    summary: 'Standing water quickly rots papaya roots.',
    body: 'Plant on raised beds or mounds where soil drains slowly. Avoid planting in low spots during the rains. Stake plants that lean after wind and remove fruit-fly damaged fruit from the ground.',
  },
  {
    id: 'adv-17',
    title: 'Manage banana suckers and bunches',
    category: 'general',
    crop: 'banana',
    language: 'en',
    summary: 'Keep two or three strong suckers per mat.',
    body: 'Remove excess suckers so the mother plant and one or two followers can size well. Prop heavy bunches before they pull the stem over. Chop old stems and leaves and use them as mulch around the mat.',
  },
  {
    id: 'adv-18',
    title: 'Citrus leaf miner on lime',
    category: 'pest',
    crop: 'lime',
    language: 'en',
    summary: 'Silver winding trails on young leaves.',
    body: 'Prune affected shoots on young trees and encourage natural enemies. Avoid excessive nitrogen flushes that attract the moth. Keep young trees watered through the dry season and mulch around the base.',
  },
  {
    id: 'adv-19',
    title: 'Downy mildew in cucumber',
    category: 'disease',
    crop: 'cucumber',
    language: 'en',
    summary: 'Angular yellow patches on leaves in humid weather.',
    body: 'Grow cucumbers on trellises for airflow, water at the base early in the day, and remove badly affected leaves. Avoid overcrowding. Rotate away from cucumber and other cucurbits.',
  },
  {
    id: 'adv-20',
    title: 'Harvest moringa leaves for repeated cuts',
    category: 'general',
    crop: 'moringa',
    language: 'en',
    summary: 'Cut back regularly for tender leaves.',
    body: 'Harvest young shoots and leaves, leaving enough stem for regrowth. Avoid stripping the whole tree at once. Dry leaves in the shade to keep colour and nutrients, and store in airtight containers away from light.',
  },
  {
    id: 'adv-21',
    title: 'Lift and dry tiger nut after the rains',
    category: 'storage',
    crop: 'tiger_nut',
    language: 'en',
    summary: 'Wash, sort and dry tubers before sale.',
    body: 'Loosen soil and lift tubers when tops die back. Wash in clean water, remove damaged tubers, and dry in the shade before bagging. Store in a cool, ventilated place and check for mould.',
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
