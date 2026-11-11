export const MARKETS = [
  {
    id: 'serrekunda',
    name: 'Serrekunda Market',
    region: 'kanifing',
    location: 'Serrekunda',
    marketDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    cropsTraded: ['onion', 'tomato', 'cabbage', 'mango', 'groundnut', 'pepper', 'cucumber', 'lime'],
    note: 'Busy peri-urban wholesale hub.',
  },
  {
    id: 'brikama',
    name: 'Brikama Market',
    region: 'west_coast',
    location: 'Brikama',
    marketDays: ['Tue', 'Thu', 'Sat'],
    cropsTraded: ['groundnut', 'cassava', 'mango', 'cashew', 'tomato', 'watermelon', 'banana', 'papaya'],
    note: 'Strong demand from hotels and traders.',
  },
  {
    id: 'farafenni',
    name: 'Farafenni Market',
    region: 'north_bank',
    location: 'Farafenni',
    marketDays: ['Wed', 'Sat'],
    cropsTraded: ['groundnut', 'millet', 'maize', 'sorghum', 'onion', 'cowpea', 'pepper'],
    note: 'Key North Bank cash-crop market.',
  },
  {
    id: 'basse',
    name: 'Basse Market',
    region: 'upper_river',
    location: 'Basse',
    marketDays: ['Mon', 'Thu'],
    cropsTraded: ['groundnut', 'millet', 'sorghum', 'rice', 'cashew', 'sesame'],
    note: 'Upper River Region trading centre.',
  },
  {
    id: 'soma',
    name: 'Soma Market',
    region: 'lower_river',
    location: 'Soma',
    marketDays: ['Tue', 'Fri'],
    cropsTraded: ['rice', 'groundnut', 'cassava', 'onion', 'tomato', 'sweet_potato', 'tiger_nut'],
    note: 'Transit point between upcountry and coast.',
  },
  {
    id: 'kerewan',
    name: 'Kerewan Market',
    region: 'north_bank',
    location: 'Kerewan',
    marketDays: ['Mon', 'Thu'],
    cropsTraded: ['okra', 'onion', 'millet', 'moringa', 'cowpea', 'groundnut'],
    note: 'North Bank garden produce and grain.',
  },
  {
    id: 'kuntaur',
    name: 'Kuntaur Market',
    region: 'central_river_north',
    location: 'Kuntaur',
    marketDays: ['Tue', 'Sat'],
    cropsTraded: ['millet', 'sorghum', 'groundnut', 'rice', 'maize'],
    note: 'River port market for inland grain.',
  },
  {
    id: 'janjanbureh',
    name: 'Janjanbureh Market',
    region: 'central_river_south',
    location: 'Janjanbureh',
    marketDays: ['Wed', 'Sat'],
    cropsTraded: ['rice', 'millet', 'maize', 'groundnut', 'cowpea'],
    note: 'Central River South collection point.',
  },
  {
    id: 'mansakonko',
    name: 'Mansakonko Market',
    region: 'lower_river',
    location: 'Mansakonko',
    marketDays: ['Mon', 'Fri'],
    cropsTraded: ['rice', 'cassava', 'tiger_nut', 'groundnut', 'millet'],
    note: 'Lower River administrative and trading town.',
  },
  {
    id: 'banjul',
    name: 'Banjul Market',
    region: 'banjul',
    location: 'Banjul',
    marketDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    cropsTraded: ['onion', 'tomato', 'lime', 'mango', 'rice'],
    note: 'Capital city retail and hospitality demand.',
  },
  {
    id: 'gunjur',
    name: 'Gunjur Market',
    region: 'west_coast',
    location: 'Gunjur',
    marketDays: ['Tue', 'Fri'],
    cropsTraded: ['mango', 'papaya', 'tomato', 'watermelon', 'banana'],
    note: 'Coastal market serving hotels and fishing communities.',
  },
  {
    id: 'fatoto',
    name: 'Fatoto Market',
    region: 'upper_river',
    location: 'Fatoto',
    marketDays: ['Thu', 'Sun'],
    cropsTraded: ['sesame', 'groundnut', 'sorghum', 'millet'],
    note: 'Eastern Upper River border market.',
  },
  {
    id: 'essau',
    name: 'Essau Market',
    region: 'north_bank',
    location: 'Essau',
    marketDays: ['Mon', 'Thu'],
    cropsTraded: ['groundnut', 'cowpea', 'okra', 'onion'],
    note: 'North Bank market near the ferry crossing.',
  },
];

/** Latest GMD/kg prices by crop and market, plus simple history for charts. */
export const PRICE_ROWS = [
  { crop: 'groundnut', marketId: 'farafenni', pricePerKg: 48, previous: 44, history: [38, 40, 41, 43, 44, 46, 48], source: 'demo market survey' },
  { crop: 'groundnut', marketId: 'brikama', pricePerKg: 45, previous: 46, history: [42, 43, 44, 45, 46, 45, 45], source: 'demo cooperative report' },
  { crop: 'groundnut', marketId: 'serrekunda', pricePerKg: 50, previous: 47, history: [40, 42, 44, 45, 47, 48, 50], source: 'demo trader report' },
  { crop: 'groundnut', marketId: 'basse', pricePerKg: 42, previous: 41, history: [36, 37, 38, 39, 40, 41, 42], source: 'demo market survey' },
  { crop: 'groundnut', marketId: 'soma', pricePerKg: 44, previous: 43, history: [38, 39, 40, 41, 42, 43, 44], source: 'demo market survey' },
  { crop: 'groundnut', marketId: 'kerewan', pricePerKg: 46, previous: 44, history: [40, 41, 42, 43, 44, 45, 46], source: 'demo cooperative report' },
  { crop: 'groundnut', marketId: 'janjanbureh', pricePerKg: 43, previous: 42, history: [38, 39, 40, 41, 42, 42, 43], source: 'demo trader report' },
  { crop: 'onion', marketId: 'serrekunda', pricePerKg: 55, previous: 60, history: [62, 61, 60, 58, 57, 56, 55], source: 'demo market survey' },
  { crop: 'onion', marketId: 'brikama', pricePerKg: 52, previous: 54, history: [58, 56, 55, 54, 53, 52, 52], source: 'demo cooperative report' },
  { crop: 'onion', marketId: 'farafenni', pricePerKg: 48, previous: 50, history: [54, 53, 52, 51, 50, 49, 48], source: 'demo market survey' },
  { crop: 'onion', marketId: 'kerewan', pricePerKg: 47, previous: 49, history: [53, 52, 51, 50, 49, 48, 47], source: 'demo cooperative report' },
  { crop: 'onion', marketId: 'banjul', pricePerKg: 52, previous: 51, history: [48, 49, 50, 50, 51, 51, 52], source: 'demo trader report' },
  { crop: 'tomato', marketId: 'serrekunda', pricePerKg: 40, previous: 38, history: [32, 33, 35, 36, 37, 38, 40], source: 'demo market survey' },
  { crop: 'tomato', marketId: 'brikama', pricePerKg: 38, previous: 39, history: [34, 35, 36, 37, 39, 38, 38], source: 'demo cooperative report' },
  { crop: 'tomato', marketId: 'gunjur', pricePerKg: 36, previous: 37, history: [33, 34, 35, 36, 37, 37, 36], source: 'demo trader report' },
  { crop: 'millet', marketId: 'farafenni', pricePerKg: 28, previous: 27, history: [24, 25, 25, 26, 27, 27, 28], source: 'demo market survey' },
  { crop: 'millet', marketId: 'basse', pricePerKg: 26, previous: 26, history: [23, 24, 24, 25, 25, 26, 26], source: 'demo market survey' },
  { crop: 'millet', marketId: 'kuntaur', pricePerKg: 26, previous: 25, history: [22, 23, 24, 24, 25, 25, 26], source: 'demo cooperative report' },
  { crop: 'rice', marketId: 'soma', pricePerKg: 35, previous: 34, history: [30, 31, 32, 33, 34, 34, 35], source: 'demo market survey' },
  { crop: 'rice', marketId: 'basse', pricePerKg: 33, previous: 32, history: [29, 30, 30, 31, 32, 32, 33], source: 'demo market survey' },
  { crop: 'rice', marketId: 'janjanbureh', pricePerKg: 32, previous: 31, history: [28, 29, 30, 30, 31, 31, 32], source: 'demo cooperative report' },
  { crop: 'mango', marketId: 'brikama', pricePerKg: 22, previous: 20, history: [16, 17, 18, 19, 20, 21, 22], source: 'demo cooperative report' },
  { crop: 'mango', marketId: 'serrekunda', pricePerKg: 25, previous: 23, history: [18, 19, 20, 21, 22, 23, 25], source: 'demo trader report' },
  { crop: 'mango', marketId: 'gunjur', pricePerKg: 21, previous: 20, history: [17, 18, 19, 20, 20, 20, 21], source: 'demo market survey' },
  { crop: 'mango', marketId: 'banjul', pricePerKg: 24, previous: 23, history: [19, 20, 21, 22, 23, 23, 24], source: 'demo trader report' },
  { crop: 'cassava', marketId: 'brikama', pricePerKg: 18, previous: 18, history: [16, 16, 17, 17, 18, 18, 18], source: 'demo cooperative report' },
  { crop: 'cassava', marketId: 'mansakonko', pricePerKg: 17, previous: 17, history: [15, 16, 16, 16, 17, 17, 17], source: 'demo market survey' },
  { crop: 'cabbage', marketId: 'serrekunda', pricePerKg: 30, previous: 32, history: [34, 33, 32, 32, 31, 30, 30], source: 'demo market survey' },
  { crop: 'cabbage', marketId: 'brikama', pricePerKg: 30, previous: 31, history: [33, 32, 32, 31, 31, 30, 30], source: 'demo cooperative report' },
  { crop: 'maize', marketId: 'farafenni', pricePerKg: 24, previous: 23, history: [20, 21, 21, 22, 23, 23, 24], source: 'demo market survey' },
  { crop: 'maize', marketId: 'basse', pricePerKg: 23, previous: 22, history: [19, 20, 21, 21, 22, 22, 23], source: 'demo cooperative report' },
  { crop: 'sorghum', marketId: 'basse', pricePerKg: 22, previous: 21, history: [18, 19, 20, 20, 21, 21, 22], source: 'demo market survey' },
  { crop: 'sorghum', marketId: 'kuntaur', pricePerKg: 21, previous: 21, history: [18, 19, 19, 20, 20, 21, 21], source: 'demo cooperative report' },
  { crop: 'cashew', marketId: 'basse', pricePerKg: 56, previous: 54, history: [48, 50, 51, 52, 54, 55, 56], source: 'demo market survey' },
  { crop: 'cashew', marketId: 'brikama', pricePerKg: 54, previous: 53, history: [47, 48, 50, 51, 52, 53, 54], source: 'demo cooperative report' },
  { crop: 'okra', marketId: 'serrekunda', pricePerKg: 36, previous: 34, history: [29, 30, 31, 32, 33, 34, 36], source: 'demo market survey' },
  { crop: 'okra', marketId: 'kerewan', pricePerKg: 34, previous: 33, history: [28, 29, 30, 31, 32, 33, 34], source: 'demo cooperative report' },
  { crop: 'okra', marketId: 'brikama', pricePerKg: 33, previous: 34, history: [30, 31, 32, 33, 34, 34, 33], source: 'demo market survey' },
  { crop: 'pepper', marketId: 'serrekunda', pricePerKg: 48, previous: 45, history: [38, 40, 41, 43, 45, 46, 48], source: 'demo trader report' },
  { crop: 'pepper', marketId: 'brikama', pricePerKg: 44, previous: 42, history: [36, 37, 39, 40, 41, 42, 44], source: 'demo cooperative report' },
  { crop: 'pepper', marketId: 'farafenni', pricePerKg: 42, previous: 41, history: [35, 36, 38, 39, 40, 41, 42], source: 'demo market survey' },
  { crop: 'sweet_potato', marketId: 'soma', pricePerKg: 20, previous: 19, history: [16, 17, 17, 18, 19, 19, 20], source: 'demo market survey' },
  { crop: 'sweet_potato', marketId: 'brikama', pricePerKg: 22, previous: 21, history: [17, 18, 19, 20, 20, 21, 22], source: 'demo cooperative report' },
  { crop: 'sesame', marketId: 'basse', pricePerKg: 55, previous: 52, history: [45, 47, 48, 50, 51, 53, 55], source: 'demo cooperative report' },
  { crop: 'sesame', marketId: 'fatoto', pricePerKg: 53, previous: 51, history: [44, 45, 47, 48, 50, 51, 53], source: 'demo market survey' },
  { crop: 'cowpea', marketId: 'farafenni', pricePerKg: 31, previous: 30, history: [26, 27, 28, 29, 29, 30, 31], source: 'demo market survey' },
  { crop: 'cowpea', marketId: 'kerewan', pricePerKg: 30, previous: 29, history: [25, 26, 27, 28, 28, 29, 30], source: 'demo cooperative report' },
  { crop: 'watermelon', marketId: 'brikama', pricePerKg: 16, previous: 15, history: [12, 13, 13, 14, 14, 15, 16], source: 'demo cooperative report' },
  { crop: 'watermelon', marketId: 'serrekunda', pricePerKg: 18, previous: 17, history: [13, 14, 15, 15, 16, 17, 18], source: 'demo trader report' },
  { crop: 'papaya', marketId: 'gunjur', pricePerKg: 19, previous: 18, history: [15, 16, 16, 17, 18, 18, 19], source: 'demo market survey' },
  { crop: 'papaya', marketId: 'serrekunda', pricePerKg: 22, previous: 21, history: [17, 18, 19, 20, 20, 21, 22], source: 'demo trader report' },
  { crop: 'banana', marketId: 'brikama', pricePerKg: 26, previous: 24, history: [20, 21, 22, 23, 24, 25, 26], source: 'demo cooperative report' },
  { crop: 'banana', marketId: 'serrekunda', pricePerKg: 28, previous: 27, history: [22, 23, 24, 25, 26, 27, 28], source: 'demo trader report' },
  { crop: 'lime', marketId: 'serrekunda', pricePerKg: 42, previous: 40, history: [34, 36, 37, 38, 39, 40, 42], source: 'demo trader report' },
  { crop: 'lime', marketId: 'banjul', pricePerKg: 44, previous: 42, history: [35, 37, 38, 40, 41, 42, 44], source: 'demo market survey' },
  { crop: 'cucumber', marketId: 'serrekunda', pricePerKg: 29, previous: 28, history: [24, 25, 26, 27, 27, 28, 29], source: 'demo trader report' },
  { crop: 'cucumber', marketId: 'brikama', pricePerKg: 27, previous: 27, history: [23, 24, 25, 26, 26, 27, 27], source: 'demo cooperative report' },
  { crop: 'moringa', marketId: 'kerewan', pricePerKg: 62, previous: 58, history: [50, 52, 54, 56, 58, 60, 62], source: 'demo cooperative report' },
  { crop: 'moringa', marketId: 'serrekunda', pricePerKg: 66, previous: 63, history: [54, 56, 58, 60, 62, 64, 66], source: 'demo trader report' },
  { crop: 'tiger_nut', marketId: 'soma', pricePerKg: 49, previous: 47, history: [42, 43, 44, 45, 46, 47, 49], source: 'demo market survey' },
  { crop: 'tiger_nut', marketId: 'mansakonko', pricePerKg: 47, previous: 46, history: [41, 42, 43, 44, 45, 46, 47], source: 'demo cooperative report' },
];

export function getMarket(id) {
  return MARKETS.find((m) => m.id === id);
}

export function getLatestPrices({ crop, marketId, region } = {}) {
  let rows = PRICE_ROWS.map((row) => {
    const market = getMarket(row.marketId);
    const trend = row.pricePerKg > row.previous ? 'up' : row.pricePerKg < row.previous ? 'down' : 'flat';
    return { ...row, market, trend, change: row.pricePerKg - row.previous };
  });
  if (crop) rows = rows.filter((r) => r.crop === crop);
  if (marketId) rows = rows.filter((r) => r.marketId === marketId);
  if (region) rows = rows.filter((r) => r.market?.region === region);
  return rows;
}

export function compareCropPrices(crop) {
  const rows = getLatestPrices({ crop }).sort((a, b) => b.pricePerKg - a.pricePerKg);
  const best = rows[0];
  return { crop, rows, bestMarket: best?.market, bestPrice: best?.pricePerKg };
}

export function priceHistorySeries(crop, marketId) {
  const row = PRICE_ROWS.find((r) => r.crop === crop && r.marketId === marketId);
  if (!row) return [];
  return row.history.map((price, index) => ({
    day: `D-${row.history.length - 1 - index}`,
    price,
  }));
}
