export const MARKETS = [
  {
    id: 'serrekunda',
    name: 'Serrekunda Market',
    region: 'kanifing',
    location: 'Serrekunda',
    marketDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    cropsTraded: ['onion', 'tomato', 'cabbage', 'mango', 'groundnut'],
    note: 'Busy peri-urban wholesale hub.',
  },
  {
    id: 'brikama',
    name: 'Brikama Market',
    region: 'west_coast',
    location: 'Brikama',
    marketDays: ['Tue', 'Thu', 'Sat'],
    cropsTraded: ['groundnut', 'cassava', 'mango', 'cashew', 'tomato'],
    note: 'Strong demand from hotels and traders.',
  },
  {
    id: 'farafenni',
    name: 'Farafenni Market',
    region: 'north_bank',
    location: 'Farafenni',
    marketDays: ['Wed', 'Sat'],
    cropsTraded: ['groundnut', 'millet', 'maize', 'sorghum', 'onion'],
    note: 'Key North Bank cash-crop market.',
  },
  {
    id: 'basse',
    name: 'Basse Market',
    region: 'upper_river',
    location: 'Basse',
    marketDays: ['Mon', 'Thu'],
    cropsTraded: ['groundnut', 'millet', 'sorghum', 'rice', 'cashew'],
    note: 'Upper River Region trading centre.',
  },
  {
    id: 'soma',
    name: 'Soma Market',
    region: 'lower_river',
    location: 'Soma',
    marketDays: ['Tue', 'Fri'],
    cropsTraded: ['rice', 'groundnut', 'cassava', 'onion', 'tomato'],
    note: 'Transit point between upcountry and coast.',
  },
];

/** Latest GMD/kg prices by crop and market, plus simple history for charts. */
export const PRICE_ROWS = [
  { crop: 'groundnut', marketId: 'farafenni', pricePerKg: 48, previous: 44, history: [38, 40, 41, 43, 44, 46, 48] },
  { crop: 'groundnut', marketId: 'brikama', pricePerKg: 45, previous: 46, history: [42, 43, 44, 45, 46, 45, 45] },
  { crop: 'groundnut', marketId: 'serrekunda', pricePerKg: 50, previous: 47, history: [40, 42, 44, 45, 47, 48, 50] },
  { crop: 'groundnut', marketId: 'basse', pricePerKg: 42, previous: 41, history: [36, 37, 38, 39, 40, 41, 42] },
  { crop: 'groundnut', marketId: 'soma', pricePerKg: 44, previous: 43, history: [38, 39, 40, 41, 42, 43, 44] },
  { crop: 'onion', marketId: 'serrekunda', pricePerKg: 55, previous: 60, history: [62, 61, 60, 58, 57, 56, 55] },
  { crop: 'onion', marketId: 'brikama', pricePerKg: 52, previous: 54, history: [58, 56, 55, 54, 53, 52, 52] },
  { crop: 'onion', marketId: 'farafenni', pricePerKg: 48, previous: 50, history: [54, 53, 52, 51, 50, 49, 48] },
  { crop: 'tomato', marketId: 'serrekunda', pricePerKg: 40, previous: 38, history: [32, 33, 35, 36, 37, 38, 40] },
  { crop: 'tomato', marketId: 'brikama', pricePerKg: 38, previous: 39, history: [34, 35, 36, 37, 39, 38, 38] },
  { crop: 'millet', marketId: 'farafenni', pricePerKg: 28, previous: 27, history: [24, 25, 25, 26, 27, 27, 28] },
  { crop: 'millet', marketId: 'basse', pricePerKg: 26, previous: 26, history: [23, 24, 24, 25, 25, 26, 26] },
  { crop: 'rice', marketId: 'soma', pricePerKg: 35, previous: 34, history: [30, 31, 32, 33, 34, 34, 35] },
  { crop: 'rice', marketId: 'basse', pricePerKg: 33, previous: 32, history: [29, 30, 30, 31, 32, 32, 33] },
  { crop: 'mango', marketId: 'brikama', pricePerKg: 22, previous: 20, history: [16, 17, 18, 19, 20, 21, 22] },
  { crop: 'mango', marketId: 'serrekunda', pricePerKg: 25, previous: 23, history: [18, 19, 20, 21, 22, 23, 25] },
  { crop: 'cassava', marketId: 'brikama', pricePerKg: 18, previous: 18, history: [16, 16, 17, 17, 18, 18, 18] },
  { crop: 'cabbage', marketId: 'serrekunda', pricePerKg: 30, previous: 32, history: [34, 33, 32, 32, 31, 30, 30] },
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
