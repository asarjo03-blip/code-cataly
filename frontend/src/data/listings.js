import { readJson, writeJson } from '../utils/storage.js';

const SEED_LISTINGS = [
  {
    id: 'lst-1',
    farmerName: 'Fatou Jallow',
    farmerPhone: '+220 300 1001',
    crop: 'groundnut',
    quantity: 500,
    unit: 'kg',
    askingPrice: 46,
    region: 'north_bank',
    village: 'Farafenni',
    availableFrom: '2026-10-20',
    status: 'open',
    notes: 'Well dried, ready for traders.',
    image: 'groundnut',
  },
  {
    id: 'lst-2',
    farmerName: 'Ousman Bah',
    farmerPhone: '+220 300 1002',
    crop: 'onion',
    quantity: 200,
    unit: 'kg',
    askingPrice: 50,
    region: 'west_coast',
    village: 'Brikama',
    availableFrom: '2026-10-18',
    status: 'open',
    notes: 'Irrigated dry-season onions.',
    image: 'onion',
  },
  {
    id: 'lst-3',
    farmerName: 'Mariama Camara',
    farmerPhone: '+220 300 1003',
    crop: 'tomato',
    quantity: 80,
    unit: 'kg',
    askingPrice: 38,
    region: 'kanifing',
    village: 'Serrekunda',
    availableFrom: '2026-10-19',
    status: 'open',
    notes: 'Fresh pick this morning.',
    image: 'tomato',
  },
  {
    id: 'lst-4',
    farmerName: 'Sainey Sowe',
    farmerPhone: '+220 300 1004',
    crop: 'mango',
    quantity: 120,
    unit: 'kg',
    askingPrice: 20,
    region: 'west_coast',
    village: 'Gunjur',
    availableFrom: '2026-10-22',
    status: 'open',
    notes: 'Kent variety, export grade.',
    image: 'mango',
  },
  {
    id: 'lst-5',
    farmerName: 'Awa Touray',
    farmerPhone: '+220 300 1005',
    crop: 'rice',
    quantity: 300,
    unit: 'kg',
    askingPrice: 34,
    region: 'lower_river',
    village: 'Soma',
    availableFrom: '2026-10-21',
    status: 'open',
    notes: 'Local paddy, clean bags.',
    image: 'rice',
  },
  {
    id: 'lst-6',
    farmerName: 'Kebba Njie',
    farmerPhone: '+220 300 1006',
    crop: 'millet',
    quantity: 250,
    unit: 'kg',
    askingPrice: 27,
    region: 'central_river_south',
    village: 'Janjanbureh',
    availableFrom: '2026-10-25',
    status: 'open',
    notes: 'Early millet harvest.',
    image: 'millet',
  },
];

const SEED_REQUESTS = [
  {
    id: 'br-1',
    buyerName: 'Lamin Ceesay Trading',
    buyerPhone: '+220 200 2001',
    crop: 'groundnut',
    quantity: 1000,
    unit: 'kg',
    offerPrice: 47,
    region: 'north_bank',
    neededBy: '2026-10-28',
    status: 'open',
    notes: 'Collecting for Serrekunda wholesale.',
  },
  {
    id: 'br-2',
    buyerName: 'Coastal Hotels Supply',
    buyerPhone: '+220 200 2002',
    crop: 'tomato',
    quantity: 50,
    unit: 'kg',
    offerPrice: 42,
    region: 'kanifing',
    neededBy: '2026-10-20',
    status: 'open',
    notes: 'Weekly hotel kitchen order.',
  },
  {
    id: 'br-3',
    buyerName: 'School Feeding Co-op',
    buyerPhone: '+220 200 2003',
    crop: 'onion',
    quantity: 150,
    unit: 'kg',
    offerPrice: 49,
    region: 'west_coast',
    neededBy: '2026-10-30',
    status: 'open',
    notes: 'Bulk for canteens.',
  },
];

function ensureListings() {
  const existing = readJson('listings', null);
  if (!existing) {
    writeJson('listings', SEED_LISTINGS);
    return SEED_LISTINGS;
  }
  return existing;
}

function ensureRequests() {
  const existing = readJson('buyRequests', null);
  if (!existing) {
    writeJson('buyRequests', SEED_REQUESTS);
    return SEED_REQUESTS;
  }
  return existing;
}

export function listListings(filters = {}) {
  let items = ensureListings().filter((l) => l.status === 'open' || filters.includeAll);
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
  let items = ensureRequests().filter((r) => r.status === 'open' || filters.includeAll);
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
