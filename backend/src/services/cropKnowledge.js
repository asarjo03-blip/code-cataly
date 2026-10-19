import { REGIONS } from '../config/constants.js';

const allRegions = Object.values(REGIONS);

export const CROP_KNOWLEDGE = [
  {
    slug: 'groundnut',
    name: 'Groundnut',
    category: 'cash',
    seasons: ['rainy'],
    regions: allRegions.filter((region) => region !== REGIONS.BANJUL),
    notes: 'Gambia’s main cash crop. Sow with reliable rains; harvest and dry promptly to limit aflatoxin.',
  },
  {
    slug: 'rice',
    name: 'Rice',
    category: 'staple',
    seasons: ['rainy', 'dry'],
    regions: [
      REGIONS.WEST_COAST,
      REGIONS.NORTH_BANK,
      REGIONS.LOWER_RIVER,
      REGIONS.CENTRAL_RIVER_NORTH,
      REGIONS.CENTRAL_RIVER_SOUTH,
      REGIONS.UPPER_RIVER,
    ],
    notes: 'Lowland and tidal rice along the Gambia River; dry-season production needs reliable irrigation.',
  },
  {
    slug: 'millet',
    name: 'Millet',
    category: 'staple',
    seasons: ['rainy'],
    regions: allRegions.filter((region) => region !== REGIONS.BANJUL),
    notes: 'Drought-tolerant early cereal; useful as a food-security crop on upland soils.',
  },
  {
    slug: 'maize',
    name: 'Maize',
    category: 'staple',
    seasons: ['rainy'],
    regions: allRegions.filter((region) => region !== REGIONS.BANJUL),
    notes: 'Needs timely weeding and nitrogen; plant with the onset of rains.',
  },
  {
    slug: 'sorghum',
    name: 'Sorghum',
    category: 'staple',
    seasons: ['rainy'],
    regions: [REGIONS.NORTH_BANK, REGIONS.CENTRAL_RIVER_NORTH, REGIONS.CENTRAL_RIVER_SOUTH, REGIONS.UPPER_RIVER],
    notes: 'Suited to drier inland zones; watch birds near grain fill.',
  },
  {
    slug: 'cassava',
    name: 'Cassava',
    category: 'staple',
    seasons: ['rainy', 'dry'],
    regions: allRegions.filter((region) => region !== REGIONS.BANJUL),
    notes: 'Plant cuttings early in the rains; harvest as needed for household food and market.',
  },
  {
    slug: 'onion',
    name: 'Onion',
    category: 'horticulture',
    seasons: ['dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.NORTH_BANK, REGIONS.LOWER_RIVER, REGIONS.KANIFING],
    notes: 'Dry-season irrigated vegetable with strong peri-urban market demand.',
  },
  {
    slug: 'tomato',
    name: 'Tomato',
    category: 'horticulture',
    seasons: ['dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.KANIFING, REGIONS.NORTH_BANK, REGIONS.LOWER_RIVER],
    notes: 'Shade and frequent irrigation reduce blossom drop in the hot months.',
  },
  {
    slug: 'cabbage',
    name: 'Cabbage',
    category: 'horticulture',
    seasons: ['dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.KANIFING, REGIONS.NORTH_BANK],
    notes: 'Cooler dry months (Nov–Feb) give the best head formation.',
  },
  {
    slug: 'mango',
    name: 'Mango',
    category: 'tree',
    seasons: ['dry'],
    regions: allRegions,
    notes: 'Harvest typically peaks in the dry season; protect fruit from fruit fly.',
  },
  {
    slug: 'cashew',
    name: 'Cashew',
    category: 'tree',
    seasons: ['dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.NORTH_BANK, REGIONS.LOWER_RIVER, REGIONS.UPPER_RIVER],
    notes: 'Flowering and nut set occur in the dry season; keep firebreaks around orchards.',
  },
];

export function findCrop(slugOrName) {
  const key = String(slugOrName || '').trim().toLowerCase();
  return CROP_KNOWLEDGE.find((crop) => crop.slug === key || crop.name.toLowerCase() === key);
}

export function normalizeCrops(crops = []) {
  return crops
    .map((crop) => findCrop(crop)?.slug)
    .filter(Boolean);
}
