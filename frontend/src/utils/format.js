export const REGION_LABELS = {
  banjul: 'Banjul',
  kanifing: 'Kanifing',
  west_coast: 'West Coast (Brikama)',
  north_bank: 'North Bank (Kerewan)',
  lower_river: 'Lower River (Mansakonko)',
  central_river_north: 'Central River North',
  central_river_south: 'Central River South',
  upper_river: 'Upper River (Basse)',
};

export const CROP_LABELS = {
  groundnut: 'Groundnut',
  rice: 'Rice',
  millet: 'Millet',
  maize: 'Maize',
  sorghum: 'Sorghum',
  cassava: 'Cassava',
  onion: 'Onion',
  tomato: 'Tomato',
  cabbage: 'Cabbage',
  mango: 'Mango',
  cashew: 'Cashew',
};

export const ROLE_LABELS = {
  farmer: 'Farmer',
  vendor: 'Buyer / Trader',
  extension_officer: 'Extension Officer',
  admin: 'Admin',
};

export function formatRegion(region) {
  return REGION_LABELS[region] || region || '—';
}

export function formatCrop(crop) {
  return CROP_LABELS[crop] || crop || '—';
}

export function formatGmd(value, unit = 'kg') {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `D${Number(value).toFixed(0)}/${unit}`;
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function trendLabel(trend) {
  if (trend === 'up') return 'Rising';
  if (trend === 'down') return 'Falling';
  return 'Stable';
}

export function whatsappLink(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '');
  const text = encodeURIComponent(message || 'Hello from AgriConnect Gambia');
  return `https://wa.me/${digits}?text=${text}`;
}

export function telLink(phone) {
  return `tel:${String(phone || '').replace(/\s/g, '')}`;
}
