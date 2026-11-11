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
  {
    slug: 'okra',
    name: 'Okra',
    category: 'horticulture',
    seasons: ['rainy', 'dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.KANIFING, REGIONS.NORTH_BANK, REGIONS.LOWER_RIVER, REGIONS.CENTRAL_RIVER_NORTH],
    notes: 'Fast-growing pod vegetable. Pick every two to three days so plants keep bearing.',
  },
  {
    slug: 'pepper',
    name: 'Chilli pepper',
    category: 'horticulture',
    seasons: ['rainy', 'dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.KANIFING, REGIONS.NORTH_BANK, REGIONS.LOWER_RIVER],
    notes: 'Strong market demand for fresh and dried chilli. Needs steady moisture and good drainage.',
  },
  {
    slug: 'sweet_potato',
    name: 'Sweet potato',
    category: 'staple',
    seasons: ['rainy'],
    regions: allRegions.filter((region) => region !== REGIONS.BANJUL),
    notes: 'Plant vines on ridges early in the rains; harvest from about three months when roots size up.',
  },
  {
    slug: 'sesame',
    name: 'Sesame',
    category: 'cash',
    seasons: ['rainy'],
    regions: [REGIONS.NORTH_BANK, REGIONS.LOWER_RIVER, REGIONS.CENTRAL_RIVER_NORTH, REGIONS.CENTRAL_RIVER_SOUTH, REGIONS.UPPER_RIVER],
    notes: 'Drought-tolerant oilseed for export and local pressing. Harvest before capsules shatter.',
  },
  {
    slug: 'cowpea',
    name: 'Cowpea',
    category: 'staple',
    seasons: ['rainy'],
    regions: allRegions.filter((region) => region !== REGIONS.BANJUL),
    notes: 'Nitrogen-fixing grain legume. Harvest promptly and dry well to avoid bruchid damage in store.',
  },
  {
    slug: 'watermelon',
    name: 'Watermelon',
    category: 'horticulture',
    seasons: ['dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.KANIFING, REGIONS.NORTH_BANK, REGIONS.LOWER_RIVER],
    notes: 'Dry-season irrigated fruit with good roadside and urban demand. Avoid overhead watering at ripening.',
  },
  {
    slug: 'papaya',
    name: 'Papaya',
    category: 'tree',
    seasons: ['rainy', 'dry'],
    regions: allRegions,
    notes: 'Fast-fruiting tree for household food and market. Plant improved hermaphrodite varieties where available.',
  },
  {
    slug: 'banana',
    name: 'Banana',
    category: 'tree',
    seasons: ['dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.KANIFING, REGIONS.LOWER_RIVER],
    notes: 'Needs reliable water and wind protection. Remove suckers and prop heavy bunches.',
  },
  {
    slug: 'lime',
    name: 'Lime',
    category: 'tree',
    seasons: ['dry'],
    regions: allRegions,
    notes: 'Citrus for juice and household use. Prune for airflow and water young trees through the dry season.',
  },
  {
    slug: 'cucumber',
    name: 'Cucumber',
    category: 'horticulture',
    seasons: ['dry'],
    regions: [REGIONS.WEST_COAST, REGIONS.KANIFING, REGIONS.NORTH_BANK],
    notes: 'Short-cycle irrigated vegetable for hotels and urban markets. Trellis to keep fruit clean.',
  },
  {
    slug: 'moringa',
    name: 'Moringa',
    category: 'tree',
    seasons: ['dry', 'rainy'],
    regions: allRegions.filter((region) => region !== REGIONS.BANJUL),
    notes: 'Leaves are highly nutritious. Cut back regularly to encourage tender leaf harvest.',
  },
  {
    slug: 'tiger_nut',
    name: 'Tiger nut',
    category: 'cash',
    seasons: ['rainy'],
    regions: [REGIONS.NORTH_BANK, REGIONS.LOWER_RIVER, REGIONS.CENTRAL_RIVER_NORTH, REGIONS.UPPER_RIVER],
    notes: 'Also called chufa or deta. Grown for sweet tubers used in drinks and snacks; lift after the rains.',
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
