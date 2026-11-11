import { readJson, writeJson } from '../utils/storage.js';

const SEED_LISTINGS = [
  { id: 'lst-1', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'groundnut', quantity: 500, unit: 'kg', askingPrice: 46, region: 'north_bank', village: 'Farafenni', availableFrom: '2026-10-20', status: 'open', notes: 'Well dried, ready for traders.', image: 'groundnut' },
  { id: 'lst-2', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'onion', quantity: 200, unit: 'kg', askingPrice: 50, region: 'west_coast', village: 'Brikama', availableFrom: '2026-10-18', status: 'open', notes: 'Irrigated dry-season onions.', image: 'onion' },
  { id: 'lst-3', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'tomato', quantity: 80, unit: 'kg', askingPrice: 38, region: 'kanifing', village: 'Serrekunda', availableFrom: '2026-10-19', status: 'open', notes: 'Fresh pick this morning.', image: 'tomato' },
  { id: 'lst-4', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'mango', quantity: 120, unit: 'kg', askingPrice: 20, region: 'west_coast', village: 'Gunjur', availableFrom: '2026-10-22', status: 'open', notes: 'Kent variety, export grade.', image: 'mango' },
  { id: 'lst-5', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'rice', quantity: 300, unit: 'kg', askingPrice: 34, region: 'lower_river', village: 'Soma', availableFrom: '2026-10-21', status: 'open', notes: 'Local paddy, clean bags.', image: 'rice' },
  { id: 'lst-6', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'millet', quantity: 250, unit: 'kg', askingPrice: 27, region: 'central_river_south', village: 'Janjanbureh', availableFrom: '2026-10-25', status: 'open', notes: 'Early millet harvest.', image: 'millet' },
  { id: 'lst-7', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'maize', quantity: 400, unit: 'kg', askingPrice: 24, region: 'north_bank', village: 'Farafenni', availableFrom: '2026-10-24', status: 'open', notes: 'Dry yellow maize in clean bags.', image: 'maize' },
  { id: 'lst-8', farmerName: 'Upper River Groundnut Union', farmerPhone: '+220 300 2002', crop: 'sorghum', quantity: 350, unit: 'kg', askingPrice: 22, region: 'upper_river', village: 'Basse', availableFrom: '2026-10-23', status: 'open', notes: 'Union collection, threshed and bagged.', image: 'sorghum' },
  { id: 'lst-9', farmerName: 'Brikama Horticulture Cooperative', farmerPhone: '+220 300 2001', crop: 'cassava', quantity: 300, unit: 'kg', askingPrice: 17, region: 'west_coast', village: 'Brikama', availableFrom: '2026-10-26', status: 'open', notes: 'Fresh tubers lifted this week.', image: 'cassava' },
  { id: 'lst-10', farmerName: 'Brikama Horticulture Cooperative', farmerPhone: '+220 300 2001', crop: 'cabbage', quantity: 150, unit: 'kg', askingPrice: 31, region: 'west_coast', village: 'Brikama', availableFrom: '2026-10-26', status: 'open', notes: 'Firm heads from cooperative beds.', image: 'cabbage' },
  { id: 'lst-11', farmerName: 'Upper River Groundnut Union', farmerPhone: '+220 300 2002', crop: 'cashew', quantity: 220, unit: 'kg', askingPrice: 55, region: 'upper_river', village: 'Basse', availableFrom: '2026-10-27', status: 'open', notes: 'Raw cashew nuts, sorted.', image: 'cashew' },
  { id: 'lst-12', farmerName: "North Bank Women's Garden Group", farmerPhone: '+220 300 2003', crop: 'okra', quantity: 90, unit: 'kg', askingPrice: 34, region: 'north_bank', village: 'Kerewan', availableFrom: '2026-10-28', status: 'open', notes: 'Tender pods picked every other day.', image: 'okra' },
  { id: 'lst-13', farmerName: 'Kanifing Fresh Produce', farmerPhone: '+220 200 3001', crop: 'pepper', quantity: 70, unit: 'kg', askingPrice: 45, region: 'kanifing', village: 'Serrekunda', availableFrom: '2026-10-28', status: 'open', notes: 'Fresh red chilli for market and restaurants.', image: 'pepper' },
  { id: 'lst-14', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'sweet_potato', quantity: 260, unit: 'kg', askingPrice: 20, region: 'lower_river', village: 'Soma', availableFrom: '2026-10-29', status: 'open', notes: 'Orange-fleshed roots, graded.', image: 'sweet_potato' },
  { id: 'lst-15', farmerName: 'Upper River Groundnut Union', farmerPhone: '+220 300 2002', crop: 'sesame', quantity: 180, unit: 'kg', askingPrice: 52, region: 'upper_river', village: 'Basse', availableFrom: '2026-10-29', status: 'open', notes: 'Clean white seed, union collection.', image: 'sesame' },
  { id: 'lst-16', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'cowpea', quantity: 300, unit: 'kg', askingPrice: 30, region: 'north_bank', village: 'Farafenni', availableFrom: '2026-10-30', status: 'open', notes: 'Black-eyed cowpea, dried and sorted.', image: 'cowpea' },
  { id: 'lst-17', farmerName: 'Brikama Horticulture Cooperative', farmerPhone: '+220 300 2001', crop: 'watermelon', quantity: 400, unit: 'kg', askingPrice: 15, region: 'west_coast', village: 'Brikama', availableFrom: '2026-10-30', status: 'open', notes: 'Irrigated melons, field graded.', image: 'watermelon' },
  { id: 'lst-18', farmerName: 'Brikama Horticulture Cooperative', farmerPhone: '+220 300 2001', crop: 'papaya', quantity: 200, unit: 'kg', askingPrice: 18, region: 'west_coast', village: 'Gunjur', availableFrom: '2026-10-31', status: 'open', notes: 'Ripe fruit for hotels and juice makers.', image: 'papaya' },
  { id: 'lst-19', farmerName: 'Brikama Horticulture Cooperative', farmerPhone: '+220 300 2001', crop: 'banana', quantity: 250, unit: 'kg', askingPrice: 25, region: 'west_coast', village: 'Brikama', availableFrom: '2026-10-31', status: 'open', notes: 'Green bunches, cut to order.', image: 'banana' },
  { id: 'lst-20', farmerName: 'Kanifing Fresh Produce', farmerPhone: '+220 200 3001', crop: 'lime', quantity: 120, unit: 'kg', askingPrice: 40, region: 'kanifing', village: 'Serrekunda', availableFrom: '2026-11-01', status: 'open', notes: 'Juicy limes, sorted by size.', image: 'lime' },
  { id: 'lst-21', farmerName: 'Kanifing Fresh Produce', farmerPhone: '+220 200 3001', crop: 'cucumber', quantity: 140, unit: 'kg', askingPrice: 28, region: 'kanifing', village: 'Serrekunda', availableFrom: '2026-11-01', status: 'open', notes: 'Trellised cucumbers, straight fruit.', image: 'cucumber' },
  { id: 'lst-22', farmerName: "North Bank Women's Garden Group", farmerPhone: '+220 300 2003', crop: 'moringa', quantity: 60, unit: 'kg', askingPrice: 60, region: 'north_bank', village: 'Kerewan', availableFrom: '2026-11-02', status: 'open', notes: "Fresh leaf bundles from the women's garden.", image: 'moringa' },
  { id: 'lst-23', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'tiger_nut', quantity: 200, unit: 'kg', askingPrice: 48, region: 'lower_river', village: 'Soma', availableFrom: '2026-11-02', status: 'open', notes: 'Washed and dried tiger nut for drinks.', image: 'tiger_nut' },
  { id: 'lst-24', farmerName: 'Upper River Groundnut Union', farmerPhone: '+220 300 2002', crop: 'rice', quantity: 500, unit: 'kg', askingPrice: 32, region: 'upper_river', village: 'Basse', availableFrom: '2026-11-03', status: 'open', notes: 'Union paddy, clean and dry.', image: 'rice' },
  { id: 'lst-25', farmerName: 'Brikama Horticulture Cooperative', farmerPhone: '+220 300 2001', crop: 'groundnut', quantity: 600, unit: 'kg', askingPrice: 44, region: 'west_coast', village: 'Brikama', availableFrom: '2026-11-03', status: 'open', notes: 'Cooperative collection for wholesale.', image: 'groundnut' },
  { id: 'lst-26', farmerName: "North Bank Women's Garden Group", farmerPhone: '+220 300 2003', crop: 'millet', quantity: 320, unit: 'kg', askingPrice: 26, region: 'central_river_north', village: 'Kuntaur', availableFrom: '2026-11-04', status: 'open', notes: 'Early millet, hand cleaned.', image: 'millet' },
  { id: 'lst-27', farmerName: "North Bank Women's Garden Group", farmerPhone: '+220 300 2003', crop: 'onion', quantity: 180, unit: 'kg', askingPrice: 47, region: 'north_bank', village: 'Kerewan', availableFrom: '2026-11-04', status: 'open', notes: 'Cured bulbs from irrigated beds.', image: 'onion' },
  { id: 'lst-28', farmerName: 'Brikama Horticulture Cooperative', farmerPhone: '+220 300 2001', crop: 'tomato', quantity: 110, unit: 'kg', askingPrice: 36, region: 'west_coast', village: 'Brikama', availableFrom: '2026-11-05', status: 'open', notes: 'Graded tomatoes for hotels.', image: 'tomato' },
  { id: 'lst-29', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'maize', quantity: 380, unit: 'kg', askingPrice: 23, region: 'central_river_south', village: 'Janjanbureh', availableFrom: '2026-11-05', status: 'open', notes: 'Dry cobs shelled and bagged.', image: 'maize' },
  { id: 'lst-30', farmerName: 'Brikama Horticulture Cooperative', farmerPhone: '+220 300 2001', crop: 'cashew', quantity: 200, unit: 'kg', askingPrice: 54, region: 'west_coast', village: 'Brikama', availableFrom: '2026-11-06', status: 'open', notes: 'Raw nuts, orchard collection.', image: 'cashew' },
  { id: 'lst-31', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'okra', quantity: 75, unit: 'kg', askingPrice: 32, region: 'lower_river', village: 'Soma', availableFrom: '2026-11-06', status: 'open', notes: 'Fresh okra for market day.', image: 'okra' },
  { id: 'lst-32', farmerName: 'Fatou Jallow', farmerPhone: '+220 300 1001', crop: 'pepper', quantity: 65, unit: 'kg', askingPrice: 42, region: 'north_bank', village: 'Farafenni', availableFrom: '2026-11-07', status: 'open', notes: 'Dried and fresh chilli available.', image: 'pepper' },
];

const SEED_REQUESTS = [
  { id: 'br-1', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'groundnut', quantity: 1000, unit: 'kg', offerPrice: 47, region: 'north_bank', neededBy: '2026-11-15', status: 'open', notes: 'Collecting for Serrekunda wholesale.' },
  { id: 'br-2', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'tomato', quantity: 50, unit: 'kg', offerPrice: 42, region: 'kanifing', neededBy: '2026-11-12', status: 'open', notes: 'Weekly hotel kitchen order.' },
  { id: 'br-3', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'onion', quantity: 150, unit: 'kg', offerPrice: 49, region: 'west_coast', neededBy: '2026-11-18', status: 'open', notes: 'Bulk for canteens.' },
  { id: 'br-4', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'rice', quantity: 800, unit: 'kg', offerPrice: 36, region: 'central_river_south', neededBy: '2026-11-20', status: 'open', notes: 'School feeding programme, monthly delivery.' },
  { id: 'br-5', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'millet', quantity: 500, unit: 'kg', offerPrice: 29, region: 'north_bank', neededBy: '2026-11-19', status: 'open', notes: 'Cereal trader buying for upcountry stores.' },
  { id: 'br-6', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'maize', quantity: 600, unit: 'kg', offerPrice: 25, region: 'upper_river', neededBy: '2026-11-22', status: 'open', notes: 'Livestock feed mill, dry grain only.' },
  { id: 'br-7', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'cassava', quantity: 400, unit: 'kg', offerPrice: 19, region: 'west_coast', neededBy: '2026-11-16', status: 'open', notes: 'Food processor buying fresh tubers.' },
  { id: 'br-8', buyerName: 'Kanifing Fresh Produce', buyerPhone: '+220 200 3001', crop: 'cabbage', quantity: 100, unit: 'kg', offerPrice: 33, region: 'kanifing', neededBy: '2026-11-14', status: 'open', notes: 'Hotel group weekly order.' },
  { id: 'br-9', buyerName: 'Kanifing Fresh Produce', buyerPhone: '+220 200 3001', crop: 'okra', quantity: 120, unit: 'kg', offerPrice: 36, region: 'north_bank', neededBy: '2026-11-17', status: 'open', notes: "Women's processing group buying for drying." },
  { id: 'br-10', buyerName: 'Kanifing Fresh Produce', buyerPhone: '+220 200 3001', crop: 'pepper', quantity: 90, unit: 'kg', offerPrice: 47, region: 'kanifing', neededBy: '2026-11-13', status: 'open', notes: 'Restaurant association, fresh chilli.' },
  { id: 'br-11', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'sweet_potato', quantity: 300, unit: 'kg', offerPrice: 22, region: 'lower_river', neededBy: '2026-11-21', status: 'open', notes: 'School meals programme.' },
  { id: 'br-12', buyerName: 'Gambia Oilseed Exporters', buyerPhone: '+220 200 3002', crop: 'sesame', quantity: 250, unit: 'kg', offerPrice: 55, region: 'upper_river', neededBy: '2026-11-25', status: 'open', notes: 'Export buyer, clean white seed.' },
  { id: 'br-13', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'cowpea', quantity: 350, unit: 'kg', offerPrice: 32, region: 'north_bank', neededBy: '2026-11-20', status: 'open', notes: 'Grain trader, dried and sorted.' },
  { id: 'br-14', buyerName: 'Kanifing Fresh Produce', buyerPhone: '+220 200 3001', crop: 'watermelon', quantity: 500, unit: 'kg', offerPrice: 17, region: 'west_coast', neededBy: '2026-11-16', status: 'open', notes: 'Fruit trader for roadside and beach sales.' },
  { id: 'br-15', buyerName: 'Kanifing Fresh Produce', buyerPhone: '+220 200 3001', crop: 'papaya', quantity: 150, unit: 'kg', offerPrice: 20, region: 'west_coast', neededBy: '2026-11-14', status: 'open', notes: 'Hotel breakfast supply.' },
  { id: 'br-16', buyerName: 'Kanifing Fresh Produce', buyerPhone: '+220 200 3001', crop: 'banana', quantity: 300, unit: 'kg', offerPrice: 27, region: 'west_coast', neededBy: '2026-11-18', status: 'open', notes: 'Wholesale buyer, green bunches.' },
  { id: 'br-17', buyerName: 'Kanifing Fresh Produce', buyerPhone: '+220 200 3001', crop: 'lime', quantity: 100, unit: 'kg', offerPrice: 43, region: 'kanifing', neededBy: '2026-11-15', status: 'open', notes: 'Juice processor buying weekly.' },
  { id: 'br-18', buyerName: 'Kanifing Fresh Produce', buyerPhone: '+220 200 3001', crop: 'cucumber', quantity: 120, unit: 'kg', offerPrice: 30, region: 'kanifing', neededBy: '2026-11-13', status: 'open', notes: 'Hotel kitchens, straight fruit.' },
  { id: 'br-19', buyerName: 'Awa Touray', buyerPhone: '+220 200 2001', crop: 'moringa', quantity: 80, unit: 'kg', offerPrice: 65, region: 'north_bank', neededBy: '2026-11-19', status: 'open', notes: 'Natural foods cooperative, fresh leaves.' },
  { id: 'br-20', buyerName: 'Gambia Oilseed Exporters', buyerPhone: '+220 200 3002', crop: 'tiger_nut', quantity: 220, unit: 'kg', offerPrice: 50, region: 'lower_river', neededBy: '2026-11-24', status: 'open', notes: 'Drink producer, washed tubers.' },
];

// Bump this when the demo seed changes so browsers with older localStorage
// still see the new products. Custom listings the user created are kept.
const SEED_VERSION = 2;

function ensureListings() {
  const existing = readJson('listings', null);
  const version = readJson('listingsSeedVersion', 0);
  if (existing && version >= SEED_VERSION) return existing;
  const custom = (existing || []).filter((item) => !/^lst-\d+$/.test(item.id || ''));
  const merged = [...SEED_LISTINGS, ...custom];
  writeJson('listings', merged);
  writeJson('listingsSeedVersion', SEED_VERSION);
  return merged;
}

function ensureRequests() {
  const existing = readJson('buyRequests', null);
  const version = readJson('buyRequestsSeedVersion', 0);
  if (existing && version >= SEED_VERSION) return existing;
  const custom = (existing || []).filter((item) => !/^br-\d+$/.test(item.id || ''));
  const merged = [...SEED_REQUESTS, ...custom];
  writeJson('buyRequests', merged);
  writeJson('buyRequestsSeedVersion', SEED_VERSION);
  return merged;
}

export function listListings(filters = {}) {
  let items = ensureListings().filter(
    (l) =>
      (l.category || 'crop') === (filters.category || 'crop') &&
      (l.status === 'open' || filters.includeAll),
  );
  if (filters.crop) items = items.filter((l) => l.crop === filters.crop);
  if (filters.region) items = items.filter((l) => l.region === filters.region);
  if (filters.minPrice != null) items = items.filter((l) => l.askingPrice >= Number(filters.minPrice));
  if (filters.maxPrice != null) items = items.filter((l) => l.askingPrice <= Number(filters.maxPrice));
  if (filters.minQty != null) items = items.filter((l) => l.quantity >= Number(filters.minQty));
  if (filters.ownerId || filters.ownerName) {
    items = items.filter(
      (l) =>
        (filters.ownerId && l.ownerId === filters.ownerId) ||
        (filters.ownerName && l.farmerName === filters.ownerName),
    );
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (l) =>
        l.crop.includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        (l.village || '').toLowerCase().includes(q) ||
        (l.notes || '').toLowerCase().includes(q),
    );
  }
  return items;
}

export function getListing(id) {
  return ensureListings().find((l) => l.id === id);
}

export function saveListing(listing) {
  const all = ensureListings();
  const index = all.findIndex((l) => l.id === listing.id);
  if (index >= 0) all[index] = listing;
  else all.unshift(listing);
  writeJson('listings', all);
  return listing;
}

export function deleteListing(id) {
  const all = ensureListings().filter((l) => l.id !== id);
  writeJson('listings', all);
}

export function listBuyRequests(filters = {}) {
  let items = ensureRequests().filter(
    (r) =>
      (r.category || 'crop') === (filters.category || 'crop') &&
      (r.status === 'open' || filters.includeAll),
  );
  if (filters.crop) items = items.filter((r) => r.crop === filters.crop);
  if (filters.region) items = items.filter((r) => r.region === filters.region);
  if (filters.ownerId || filters.ownerName) {
    items = items.filter(
      (r) =>
        (filters.ownerId && r.ownerId === filters.ownerId) ||
        (filters.ownerName && r.buyerName === filters.ownerName),
    );
  }
  return items;
}

export function saveBuyRequest(request) {
  const all = ensureRequests();
  const index = all.findIndex((r) => r.id === request.id);
  if (index >= 0) all[index] = request;
  else all.unshift(request);
  writeJson('buyRequests', all);
  return request;
}

export function matchForFarmer(crops = [], region) {
  return listBuyRequests().filter(
    (r) => crops.includes(r.crop) && (!region || r.region === region),
  );
}
