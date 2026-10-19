export const ROLES = Object.freeze({
  FARMER: 'farmer',
  VENDOR: 'vendor',
  EXTENSION_OFFICER: 'extension_officer',
  ADMIN: 'admin',
});

export const PUBLIC_REGISTER_ROLES = [ROLES.FARMER, ROLES.VENDOR, ROLES.EXTENSION_OFFICER];

export const REGIONS = Object.freeze({
  BANJUL: 'banjul',
  KANIFING: 'kanifing',
  WEST_COAST: 'west_coast',
  NORTH_BANK: 'north_bank',
  LOWER_RIVER: 'lower_river',
  CENTRAL_RIVER_NORTH: 'central_river_north',
  CENTRAL_RIVER_SOUTH: 'central_river_south',
  UPPER_RIVER: 'upper_river',
});

export const REGION_META = {
  [REGIONS.BANJUL]: {
    label: 'Banjul',
    coordinates: { lat: 13.4549, lon: -16.579 },
  },
  [REGIONS.KANIFING]: {
    label: 'Kanifing',
    coordinates: { lat: 13.443, lon: -16.6756 },
  },
  [REGIONS.WEST_COAST]: {
    label: 'West Coast Region (Brikama)',
    coordinates: { lat: 13.2714, lon: -16.6494 },
  },
  [REGIONS.NORTH_BANK]: {
    label: 'North Bank Region (Kerewan)',
    coordinates: { lat: 13.4898, lon: -16.0306 },
  },
  [REGIONS.LOWER_RIVER]: {
    label: 'Lower River Region (Mansakonko)',
    coordinates: { lat: 13.4114, lon: -15.5447 },
  },
  [REGIONS.CENTRAL_RIVER_NORTH]: {
    label: 'Central River North (Kuntaur)',
    coordinates: { lat: 13.67, lon: -14.89 },
  },
  [REGIONS.CENTRAL_RIVER_SOUTH]: {
    label: 'Central River South (Janjanbureh)',
    coordinates: { lat: 13.538, lon: -14.7638 },
  },
  [REGIONS.UPPER_RIVER]: {
    label: 'Upper River Region (Basse)',
    coordinates: { lat: 13.31, lon: -14.213 },
  },
};

export const LANGUAGES = ['en', 'wo', 'ff', 'mnk'];
