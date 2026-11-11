import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { REGIONS, ROLES } from '../config/constants.js';
import { Crop } from '../models/Crop.js';
import { Advisory } from '../models/Advisory.js';
import { Alert } from '../models/Alert.js';
import { BuyRequest } from '../models/BuyRequest.js';
import { Listing } from '../models/Listing.js';
import { Market } from '../models/Market.js';
import { MarketPrice } from '../models/MarketPrice.js';
import { User } from '../models/User.js';
import { CROP_KNOWLEDGE } from '../services/cropKnowledge.js';

const demoUsers = [
  {
    name: 'Fatou Jallow',
    email: 'farmer@agriconnect.gm',
    password: 'Password123',
    role: ROLES.FARMER,
    phone: '+220 300 1001',
    region: REGIONS.NORTH_BANK,
    village: 'Farafenni',
    crops: ['groundnut', 'millet', 'rice'],
    farmSizeHectares: 2.5,
    farmingType: 'rainfed',
  },
  {
    name: 'Lamin Ceesay',
    email: 'extension@agriconnect.gm',
    password: 'Password123',
    role: ROLES.EXTENSION_OFFICER,
    region: REGIONS.WEST_COAST,
    village: 'Brikama',
    crops: ['onion', 'tomato'],
  },
  {
    name: 'Awa Touray',
    email: 'vendor@agriconnect.gm',
    password: 'Password123',
    role: ROLES.VENDOR,
    phone: '+220 200 2001',
    region: REGIONS.KANIFING,
    village: 'Serrekunda',
    crops: ['onion', 'tomato', 'cabbage'],
  },
  {
    name: 'Admin User',
    email: 'admin@agriconnect.gm',
    password: 'Password123',
    role: ROLES.ADMIN,
    region: REGIONS.BANJUL,
  },
  {
    name: 'Brikama Horticulture Cooperative',
    email: 'brikama.coop@agriconnect.gm',
    password: 'Password123',
    role: ROLES.FARMER,
    phone: '+220 300 2001',
    region: REGIONS.WEST_COAST,
    village: 'Brikama',
    crops: ['tomato', 'onion', 'cabbage', 'okra', 'pepper', 'watermelon', 'cucumber'],
    farmSizeHectares: 6,
    farmingType: 'irrigated',
  },
  {
    name: 'Upper River Groundnut Union',
    email: 'urr.union@agriconnect.gm',
    password: 'Password123',
    role: ROLES.FARMER,
    phone: '+220 300 2002',
    region: REGIONS.UPPER_RIVER,
    village: 'Basse',
    crops: ['groundnut', 'sesame', 'sorghum', 'cashew', 'rice'],
    farmSizeHectares: 12,
    farmingType: 'rainfed',
  },
  {
    name: "North Bank Women's Garden Group",
    email: 'northbank.women@agriconnect.gm',
    password: 'Password123',
    role: ROLES.FARMER,
    phone: '+220 300 2003',
    region: REGIONS.NORTH_BANK,
    village: 'Kerewan',
    crops: ['okra', 'onion', 'moringa', 'millet'],
    farmSizeHectares: 3,
    farmingType: 'irrigated',
  },
  {
    name: 'Kanifing Fresh Produce',
    email: 'kanifing.fresh@agriconnect.gm',
    password: 'Password123',
    role: ROLES.VENDOR,
    phone: '+220 200 3001',
    region: REGIONS.KANIFING,
    village: 'Serrekunda',
    crops: ['tomato', 'pepper', 'cucumber', 'lime'],
  },
  {
    name: 'Gambia Oilseed Exporters',
    email: 'oilseed.export@agriconnect.gm',
    password: 'Password123',
    role: ROLES.VENDOR,
    phone: '+220 200 3002',
    region: REGIONS.UPPER_RIVER,
    village: 'Basse',
    crops: ['sesame', 'groundnut', 'tiger_nut'],
  },
];

const demoListings = [
  { seedKey: 'demo-groundnut', crop: 'groundnut', quantity: 500, askingPrice: 46, region: REGIONS.NORTH_BANK, village: 'Farafenni', notes: 'Well dried, ready for traders.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-onion', crop: 'onion', quantity: 200, askingPrice: 50, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Irrigated dry-season onions.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-tomato', crop: 'tomato', quantity: 80, askingPrice: 38, region: REGIONS.KANIFING, village: 'Serrekunda', notes: 'Fresh pick this morning.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-mango', crop: 'mango', quantity: 120, askingPrice: 20, region: REGIONS.WEST_COAST, village: 'Gunjur', notes: 'Kent variety, export grade.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-rice', crop: 'rice', quantity: 300, askingPrice: 34, region: REGIONS.LOWER_RIVER, village: 'Soma', notes: 'Local paddy, clean bags.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-millet', crop: 'millet', quantity: 250, askingPrice: 27, region: REGIONS.CENTRAL_RIVER_SOUTH, village: 'Janjanbureh', notes: 'Early millet harvest.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-maize-farafenni', crop: 'maize', quantity: 400, askingPrice: 24, region: REGIONS.NORTH_BANK, village: 'Farafenni', notes: 'Dry yellow maize in clean bags.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-sorghum-basse', crop: 'sorghum', quantity: 350, askingPrice: 22, region: REGIONS.UPPER_RIVER, village: 'Basse', notes: 'Union collection, threshed and bagged.', seller: 'urr.union@agriconnect.gm' },
  { seedKey: 'demo-cassava-brikama', crop: 'cassava', quantity: 300, askingPrice: 17, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Fresh tubers lifted this week.', seller: 'brikama.coop@agriconnect.gm' },
  { seedKey: 'demo-cabbage-brikama', crop: 'cabbage', quantity: 150, askingPrice: 31, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Firm heads from cooperative beds.', seller: 'brikama.coop@agriconnect.gm' },
  { seedKey: 'demo-cashew-basse', crop: 'cashew', quantity: 220, askingPrice: 55, region: REGIONS.UPPER_RIVER, village: 'Basse', notes: 'Raw cashew nuts, sorted.', seller: 'urr.union@agriconnect.gm' },
  { seedKey: 'demo-okra-kerewan', crop: 'okra', quantity: 90, askingPrice: 34, region: REGIONS.NORTH_BANK, village: 'Kerewan', notes: 'Tender pods picked every other day.', seller: 'northbank.women@agriconnect.gm' },
  { seedKey: 'demo-pepper-serrekunda', crop: 'pepper', quantity: 70, askingPrice: 45, region: REGIONS.KANIFING, village: 'Serrekunda', notes: 'Fresh red chilli for market and restaurants.', seller: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-sweet-potato-soma', crop: 'sweet_potato', quantity: 260, askingPrice: 20, region: REGIONS.LOWER_RIVER, village: 'Soma', notes: 'Orange-fleshed roots, graded.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-sesame-basse', crop: 'sesame', quantity: 180, askingPrice: 52, region: REGIONS.UPPER_RIVER, village: 'Basse', notes: 'Clean white seed, union collection.', seller: 'urr.union@agriconnect.gm' },
  { seedKey: 'demo-cowpea-farafenni', crop: 'cowpea', quantity: 300, askingPrice: 30, region: REGIONS.NORTH_BANK, village: 'Farafenni', notes: 'Black-eyed cowpea, dried and sorted.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-watermelon-brikama', crop: 'watermelon', quantity: 400, askingPrice: 15, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Irrigated melons, field graded.', seller: 'brikama.coop@agriconnect.gm' },
  { seedKey: 'demo-papaya-gunjur', crop: 'papaya', quantity: 200, askingPrice: 18, region: REGIONS.WEST_COAST, village: 'Gunjur', notes: 'Ripe fruit for hotels and juice makers.', seller: 'brikama.coop@agriconnect.gm' },
  { seedKey: 'demo-banana-brikama', crop: 'banana', quantity: 250, askingPrice: 25, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Green bunches, cut to order.', seller: 'brikama.coop@agriconnect.gm' },
  { seedKey: 'demo-lime-serekunda', crop: 'lime', quantity: 120, askingPrice: 40, region: REGIONS.KANIFING, village: 'Serrekunda', notes: 'Juicy limes, sorted by size.', seller: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-cucumber-serekunda', crop: 'cucumber', quantity: 140, askingPrice: 28, region: REGIONS.KANIFING, village: 'Serrekunda', notes: 'Trellised cucumbers, straight fruit.', seller: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-moringa-kerewan', crop: 'moringa', quantity: 60, askingPrice: 60, region: REGIONS.NORTH_BANK, village: 'Kerewan', notes: 'Fresh leaf bundles from the women\'s garden.', seller: 'northbank.women@agriconnect.gm' },
  { seedKey: 'demo-tiger-nut-soma', crop: 'tiger_nut', quantity: 200, askingPrice: 48, region: REGIONS.LOWER_RIVER, village: 'Soma', notes: 'Washed and dried tiger nut for drinks.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-rice-basse', crop: 'rice', quantity: 500, askingPrice: 32, region: REGIONS.UPPER_RIVER, village: 'Basse', notes: 'Union paddy, clean and dry.', seller: 'urr.union@agriconnect.gm' },
  { seedKey: 'demo-groundnut-brikama', crop: 'groundnut', quantity: 600, askingPrice: 44, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Cooperative collection for wholesale.', seller: 'brikama.coop@agriconnect.gm' },
  { seedKey: 'demo-millet-kuntaur', crop: 'millet', quantity: 320, askingPrice: 26, region: REGIONS.CENTRAL_RIVER_NORTH, village: 'Kuntaur', notes: 'Early millet, hand cleaned.', seller: 'northbank.women@agriconnect.gm' },
  { seedKey: 'demo-onion-kerewan', crop: 'onion', quantity: 180, askingPrice: 47, region: REGIONS.NORTH_BANK, village: 'Kerewan', notes: 'Cured bulbs from irrigated beds.', seller: 'northbank.women@agriconnect.gm' },
  { seedKey: 'demo-tomato-brikama', crop: 'tomato', quantity: 110, askingPrice: 36, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Graded tomatoes for hotels.', seller: 'brikama.coop@agriconnect.gm' },
  { seedKey: 'demo-maize-janjanbureh', crop: 'maize', quantity: 380, askingPrice: 23, region: REGIONS.CENTRAL_RIVER_SOUTH, village: 'Janjanbureh', notes: 'Dry cobs shelled and bagged.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-cashew-brikama', crop: 'cashew', quantity: 200, askingPrice: 54, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Raw nuts, orchard collection.', seller: 'brikama.coop@agriconnect.gm' },
  { seedKey: 'demo-okra-soma', crop: 'okra', quantity: 75, askingPrice: 32, region: REGIONS.LOWER_RIVER, village: 'Soma', notes: 'Fresh okra for market day.', seller: 'farmer@agriconnect.gm' },
  { seedKey: 'demo-pepper-farafenni', crop: 'pepper', quantity: 65, askingPrice: 42, region: REGIONS.NORTH_BANK, village: 'Farafenni', notes: 'Dried and fresh chilli available.', seller: 'farmer@agriconnect.gm' },
];

const demoBuyRequests = [
  { seedKey: 'demo-groundnut-request', crop: 'groundnut', quantity: 1000, offerPrice: 47, region: REGIONS.NORTH_BANK, notes: 'Collecting for Serrekunda wholesale.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-tomato-request', crop: 'tomato', quantity: 50, offerPrice: 42, region: REGIONS.KANIFING, notes: 'Weekly hotel kitchen order.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-onion-request', crop: 'onion', quantity: 150, offerPrice: 49, region: REGIONS.WEST_COAST, notes: 'Bulk for canteens.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-rice-request', crop: 'rice', quantity: 800, offerPrice: 36, region: REGIONS.CENTRAL_RIVER_SOUTH, notes: 'School feeding programme, monthly delivery.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-millet-request', crop: 'millet', quantity: 500, offerPrice: 29, region: REGIONS.NORTH_BANK, notes: 'Cereal trader buying for upcountry stores.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-maize-request', crop: 'maize', quantity: 600, offerPrice: 25, region: REGIONS.UPPER_RIVER, notes: 'Livestock feed mill, dry grain only.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-cassava-request', crop: 'cassava', quantity: 400, offerPrice: 19, region: REGIONS.WEST_COAST, notes: 'Food processor buying fresh tubers.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-cabbage-request', crop: 'cabbage', quantity: 100, offerPrice: 33, region: REGIONS.KANIFING, notes: 'Hotel group weekly order.', buyer: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-okra-request', crop: 'okra', quantity: 120, offerPrice: 36, region: REGIONS.NORTH_BANK, notes: 'Women\'s processing group buying for drying.', buyer: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-pepper-request', crop: 'pepper', quantity: 90, offerPrice: 47, region: REGIONS.KANIFING, notes: 'Restaurant association, fresh chilli.', buyer: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-sweet-potato-request', crop: 'sweet_potato', quantity: 300, offerPrice: 22, region: REGIONS.LOWER_RIVER, notes: 'School meals programme.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-sesame-request', crop: 'sesame', quantity: 250, offerPrice: 55, region: REGIONS.UPPER_RIVER, notes: 'Export buyer, clean white seed.', buyer: 'oilseed.export@agriconnect.gm' },
  { seedKey: 'demo-cowpea-request', crop: 'cowpea', quantity: 350, offerPrice: 32, region: REGIONS.NORTH_BANK, notes: 'Grain trader, dried and sorted.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-watermelon-request', crop: 'watermelon', quantity: 500, offerPrice: 17, region: REGIONS.WEST_COAST, notes: 'Fruit trader for roadside and beach sales.', buyer: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-papaya-request', crop: 'papaya', quantity: 150, offerPrice: 20, region: REGIONS.WEST_COAST, notes: 'Hotel breakfast supply.', buyer: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-banana-request', crop: 'banana', quantity: 300, offerPrice: 27, region: REGIONS.WEST_COAST, notes: 'Wholesale buyer, green bunches.', buyer: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-lime-request', crop: 'lime', quantity: 100, offerPrice: 43, region: REGIONS.KANIFING, notes: 'Juice processor buying weekly.', buyer: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-cucumber-request', crop: 'cucumber', quantity: 120, offerPrice: 30, region: REGIONS.KANIFING, notes: 'Hotel kitchens, straight fruit.', buyer: 'kanifing.fresh@agriconnect.gm' },
  { seedKey: 'demo-moringa-request', crop: 'moringa', quantity: 80, offerPrice: 65, region: REGIONS.NORTH_BANK, notes: 'Natural foods cooperative, fresh leaves.', buyer: 'vendor@agriconnect.gm' },
  { seedKey: 'demo-tiger-nut-request', crop: 'tiger_nut', quantity: 220, offerPrice: 50, region: REGIONS.LOWER_RIVER, notes: 'Drink producer, washed tubers.', buyer: 'oilseed.export@agriconnect.gm' },
];

const demoMarkets = [
  { slug: 'serrekunda', name: 'Serrekunda Market', region: REGIONS.KANIFING, location: 'Serrekunda', marketDays: ['Mon', 'Wed', 'Fri', 'Sat'], cropsTraded: ['onion', 'tomato', 'cabbage', 'mango', 'groundnut', 'pepper', 'cucumber', 'lime'], note: 'Busy peri-urban wholesale hub.' },
  { slug: 'brikama', name: 'Brikama Market', region: REGIONS.WEST_COAST, location: 'Brikama', marketDays: ['Tue', 'Thu', 'Sat'], cropsTraded: ['groundnut', 'cassava', 'mango', 'cashew', 'tomato', 'watermelon', 'banana', 'papaya'], note: 'Strong demand from hotels and traders.' },
  { slug: 'farafenni', name: 'Farafenni Market', region: REGIONS.NORTH_BANK, location: 'Farafenni', marketDays: ['Wed', 'Sat'], cropsTraded: ['groundnut', 'millet', 'maize', 'sorghum', 'onion', 'cowpea', 'pepper'], note: 'Key North Bank cash-crop market.' },
  { slug: 'basse', name: 'Basse Market', region: REGIONS.UPPER_RIVER, location: 'Basse', marketDays: ['Mon', 'Thu'], cropsTraded: ['groundnut', 'millet', 'sorghum', 'rice', 'cashew', 'sesame'], note: 'Upper River Region trading centre.' },
  { slug: 'soma', name: 'Soma Market', region: REGIONS.LOWER_RIVER, location: 'Soma', marketDays: ['Tue', 'Fri'], cropsTraded: ['rice', 'groundnut', 'cassava', 'onion', 'tomato', 'sweet_potato', 'tiger_nut'], note: 'Transit point between upcountry and coast.' },
  { slug: 'kerewan', name: 'Kerewan Market', region: REGIONS.NORTH_BANK, location: 'Kerewan', marketDays: ['Mon', 'Thu'], cropsTraded: ['okra', 'onion', 'millet', 'moringa', 'cowpea', 'groundnut'], note: 'North Bank garden produce and grain.' },
  { slug: 'kuntaur', name: 'Kuntaur Market', region: REGIONS.CENTRAL_RIVER_NORTH, location: 'Kuntaur', marketDays: ['Tue', 'Sat'], cropsTraded: ['millet', 'sorghum', 'groundnut', 'rice', 'maize'], note: 'River port market for inland grain.' },
  { slug: 'janjanbureh', name: 'Janjanbureh Market', region: REGIONS.CENTRAL_RIVER_SOUTH, location: 'Janjanbureh', marketDays: ['Wed', 'Sat'], cropsTraded: ['rice', 'millet', 'maize', 'groundnut', 'cowpea'], note: 'Central River South collection point.' },
  { slug: 'mansakonko', name: 'Mansakonko Market', region: REGIONS.LOWER_RIVER, location: 'Mansakonko', marketDays: ['Mon', 'Fri'], cropsTraded: ['rice', 'cassava', 'tiger_nut', 'groundnut', 'millet'], note: 'Lower River administrative and trading town.' },
  { slug: 'banjul', name: 'Banjul Market', region: REGIONS.BANJUL, location: 'Banjul', marketDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], cropsTraded: ['onion', 'tomato', 'lime', 'mango', 'rice'], note: 'Capital city retail and hospitality demand.' },
  { slug: 'gunjur', name: 'Gunjur Market', region: REGIONS.WEST_COAST, location: 'Gunjur', marketDays: ['Tue', 'Fri'], cropsTraded: ['mango', 'papaya', 'tomato', 'watermelon', 'banana'], note: 'Coastal market serving hotels and fishing communities.' },
  { slug: 'fatoto', name: 'Fatoto Market', region: REGIONS.UPPER_RIVER, location: 'Fatoto', marketDays: ['Thu', 'Sun'], cropsTraded: ['sesame', 'groundnut', 'sorghum', 'millet'], note: 'Eastern Upper River border market.' },
  { slug: 'essau', name: 'Essau Market', region: REGIONS.NORTH_BANK, location: 'Essau', marketDays: ['Mon', 'Thu'], cropsTraded: ['groundnut', 'cowpea', 'okra', 'onion'], note: 'North Bank market near the ferry crossing.' },
];

const demoPrices = [
  ['groundnut', 'farafenni', 48, 44, [38, 40, 41, 43, 44, 46, 48], 'demo market survey'],
  ['groundnut', 'brikama', 45, 46, [42, 43, 44, 45, 46, 45, 45], 'demo cooperative report'],
  ['groundnut', 'serrekunda', 50, 47, [40, 42, 44, 45, 47, 48, 50], 'demo trader report'],
  ['groundnut', 'basse', 42, 41, [36, 37, 38, 39, 40, 41, 42], 'demo market survey'],
  ['groundnut', 'soma', 44, 43, [38, 39, 40, 41, 42, 43, 44], 'demo market survey'],
  ['groundnut', 'kerewan', 46, 44, [40, 41, 42, 43, 44, 45, 46], 'demo cooperative report'],
  ['groundnut', 'janjanbureh', 43, 42, [38, 39, 40, 41, 42, 42, 43], 'demo trader report'],
  ['onion', 'serrekunda', 55, 60, [62, 61, 60, 58, 57, 56, 55], 'demo market survey'],
  ['onion', 'brikama', 52, 54, [58, 56, 55, 54, 53, 52, 52], 'demo cooperative report'],
  ['onion', 'farafenni', 48, 50, [54, 53, 52, 51, 50, 49, 48], 'demo market survey'],
  ['onion', 'kerewan', 47, 49, [53, 52, 51, 50, 49, 48, 47], 'demo cooperative report'],
  ['onion', 'banjul', 52, 51, [48, 49, 50, 50, 51, 51, 52], 'demo trader report'],
  ['tomato', 'serrekunda', 40, 38, [32, 33, 35, 36, 37, 38, 40], 'demo market survey'],
  ['tomato', 'brikama', 38, 39, [34, 35, 36, 37, 39, 38, 38], 'demo cooperative report'],
  ['tomato', 'gunjur', 36, 37, [33, 34, 35, 36, 37, 37, 36], 'demo trader report'],
  ['millet', 'farafenni', 28, 27, [24, 25, 25, 26, 27, 27, 28], 'demo market survey'],
  ['millet', 'basse', 26, 26, [23, 24, 24, 25, 25, 26, 26], 'demo market survey'],
  ['millet', 'kuntaur', 26, 25, [22, 23, 24, 24, 25, 25, 26], 'demo cooperative report'],
  ['rice', 'soma', 35, 34, [30, 31, 32, 33, 34, 34, 35], 'demo market survey'],
  ['rice', 'basse', 33, 32, [29, 30, 30, 31, 32, 32, 33], 'demo market survey'],
  ['rice', 'janjanbureh', 32, 31, [28, 29, 30, 30, 31, 31, 32], 'demo cooperative report'],
  ['mango', 'brikama', 22, 20, [16, 17, 18, 19, 20, 21, 22], 'demo cooperative report'],
  ['mango', 'serrekunda', 25, 23, [18, 19, 20, 21, 22, 23, 25], 'demo trader report'],
  ['mango', 'gunjur', 21, 20, [17, 18, 19, 20, 20, 20, 21], 'demo market survey'],
  ['mango', 'banjul', 24, 23, [19, 20, 21, 22, 23, 23, 24], 'demo trader report'],
  ['cassava', 'brikama', 18, 18, [16, 16, 17, 17, 18, 18, 18], 'demo cooperative report'],
  ['cassava', 'mansakonko', 17, 17, [15, 16, 16, 16, 17, 17, 17], 'demo market survey'],
  ['cabbage', 'serrekunda', 30, 32, [34, 33, 32, 32, 31, 30, 30], 'demo market survey'],
  ['cabbage', 'brikama', 30, 31, [33, 32, 32, 31, 31, 30, 30], 'demo cooperative report'],
  ['maize', 'farafenni', 24, 23, [20, 21, 21, 22, 23, 23, 24], 'demo market survey'],
  ['maize', 'basse', 23, 22, [19, 20, 21, 21, 22, 22, 23], 'demo cooperative report'],
  ['sorghum', 'basse', 22, 21, [18, 19, 20, 20, 21, 21, 22], 'demo market survey'],
  ['sorghum', 'kuntaur', 21, 21, [18, 19, 19, 20, 20, 21, 21], 'demo cooperative report'],
  ['cashew', 'basse', 56, 54, [48, 50, 51, 52, 54, 55, 56], 'demo market survey'],
  ['cashew', 'brikama', 54, 53, [47, 48, 50, 51, 52, 53, 54], 'demo cooperative report'],
  ['okra', 'serrekunda', 36, 34, [29, 30, 31, 32, 33, 34, 36], 'demo market survey'],
  ['okra', 'kerewan', 34, 33, [28, 29, 30, 31, 32, 33, 34], 'demo cooperative report'],
  ['okra', 'brikama', 33, 34, [30, 31, 32, 33, 34, 34, 33], 'demo market survey'],
  ['pepper', 'serrekunda', 48, 45, [38, 40, 41, 43, 45, 46, 48], 'demo trader report'],
  ['pepper', 'brikama', 44, 42, [36, 37, 39, 40, 41, 42, 44], 'demo cooperative report'],
  ['pepper', 'farafenni', 42, 41, [35, 36, 38, 39, 40, 41, 42], 'demo market survey'],
  ['sweet_potato', 'soma', 20, 19, [16, 17, 17, 18, 19, 19, 20], 'demo market survey'],
  ['sweet_potato', 'brikama', 22, 21, [17, 18, 19, 20, 20, 21, 22], 'demo cooperative report'],
  ['sesame', 'basse', 55, 52, [45, 47, 48, 50, 51, 53, 55], 'demo cooperative report'],
  ['sesame', 'fatoto', 53, 51, [44, 45, 47, 48, 50, 51, 53], 'demo market survey'],
  ['cowpea', 'farafenni', 31, 30, [26, 27, 28, 29, 29, 30, 31], 'demo market survey'],
  ['cowpea', 'kerewan', 30, 29, [25, 26, 27, 28, 28, 29, 30], 'demo cooperative report'],
  ['watermelon', 'brikama', 16, 15, [12, 13, 13, 14, 14, 15, 16], 'demo cooperative report'],
  ['watermelon', 'serrekunda', 18, 17, [13, 14, 15, 15, 16, 17, 18], 'demo trader report'],
  ['papaya', 'gunjur', 19, 18, [15, 16, 16, 17, 18, 18, 19], 'demo market survey'],
  ['papaya', 'serrekunda', 22, 21, [17, 18, 19, 20, 20, 21, 22], 'demo trader report'],
  ['banana', 'brikama', 26, 24, [20, 21, 22, 23, 24, 25, 26], 'demo cooperative report'],
  ['banana', 'serrekunda', 28, 27, [22, 23, 24, 25, 26, 27, 28], 'demo trader report'],
  ['lime', 'serrekunda', 42, 40, [34, 36, 37, 38, 39, 40, 42], 'demo trader report'],
  ['lime', 'banjul', 44, 42, [35, 37, 38, 40, 41, 42, 44], 'demo market survey'],
  ['cucumber', 'serrekunda', 29, 28, [24, 25, 26, 27, 27, 28, 29], 'demo trader report'],
  ['cucumber', 'brikama', 27, 27, [23, 24, 25, 26, 26, 27, 27], 'demo cooperative report'],
  ['moringa', 'kerewan', 62, 58, [50, 52, 54, 56, 58, 60, 62], 'demo cooperative report'],
  ['moringa', 'serrekunda', 66, 63, [54, 56, 58, 60, 62, 64, 66], 'demo trader report'],
  ['tiger_nut', 'soma', 49, 47, [42, 43, 44, 45, 46, 47, 49], 'demo market survey'],
  ['tiger_nut', 'mansakonko', 47, 46, [41, 42, 43, 44, 45, 46, 47], 'demo cooperative report'],
];

const demoAdvisories = [
  { seedKey: 'demo-aphids-tomato-cabbage', title: 'Aphids on tomato and cabbage', category: 'pest', crop: 'tomato', summary: 'Watch undersides of leaves in cool dry months.', body: 'Aphids cluster on young shoots and leaf undersides. Wash with soapy water early, encourage ladybirds, and avoid unnecessary broad-spectrum sprays. Remove heavily infested shoots and keep beds weed-free.' },
  { seedKey: 'demo-groundnut-leaf-spot', title: 'Groundnut leaf spot', category: 'disease', crop: 'groundnut', summary: 'Brown spots can cut yield late in the rains.', body: 'Early and late leaf spot show as brown spots with yellow halos. Use certified seed, rotate fields, space plants for airflow, and harvest promptly once pods mature. Do not store wet haulms with pods.' },
  { seedKey: 'demo-groundnut-drying', title: 'Safe groundnut drying to limit aflatoxin', category: 'storage', crop: 'groundnut', summary: 'Dry off the soil and reject mouldy pods.', body: 'Spread pods on clean tarpaulins raised off bare earth. Dry to a crisp snap before bagging. Sort out damaged or mouldy nuts. Store in cool, dry, ventilated rooms on pallets — never on damp floors.' },
  { seedKey: 'demo-compost-manure', title: 'Building soil with compost and manure', category: 'soil', crop: null, summary: 'Improve sandy uplands before planting.', body: 'Mix well-rotted manure or compost into planting hills. Mulch after establishment to hold moisture. Avoid burning crop residues where possible — return them to the soil or use as livestock bedding then compost.' },
  { seedKey: 'demo-rice-blast', title: 'Rice blast watch in humid spells', category: 'disease', crop: 'rice', summary: 'Diamond lesions on leaves after long wet periods.', body: 'Avoid excessive nitrogen early. Keep balanced water, remove infected debris, and plant resistant varieties when available. Report severe outbreaks to your extension officer.' },
  { seedKey: 'demo-mango-fruit-fly', title: 'Fruit fly management for mango', category: 'pest', crop: 'mango', summary: 'Protect ripening fruit from puncture damage.', body: 'Collect and bury fallen fruit. Harvest at the right maturity, use traps where available, and avoid leaving overripe fruit under trees. Clean packing areas to stop breeding.' },
  { seedKey: 'demo-onion-storage', title: 'Onion storage after harvest', category: 'storage', crop: 'onion', summary: 'Cure bulbs before long storage.', body: 'Cure onions in a shaded, airy place until necks are dry and skins rustle. Store in mesh bags or on racks, keep dry, and check weekly for soft bulbs.' },
  { seedKey: 'demo-planting-rains', title: 'Best practice: planting with the rains', category: 'general', crop: null, summary: 'Wait for two soaking rains before sowing rain-fed crops.', body: 'Dry planting wastes seed on sandy soils. After the first reliable rains, prepare land quickly and sow certified seed. Keep a small nursery of vegetables ready for transplant once beds hold moisture.' },
  { seedKey: 'demo-okra-picking', title: 'Pick okra every two to three days', category: 'general', crop: 'okra', summary: 'Regular picking keeps plants productive.', body: 'Harvest tender pods while they snap easily. Leaving pods on the plant stops new flowers and makes pods fibrous. Wear gloves and long sleeves because okra leaves can irritate skin.' },
  { seedKey: 'demo-okra-virus', title: 'Okra yellow mosaic and whitefly', category: 'disease', crop: 'okra', summary: 'Yellow mottled leaves point to virus spread by whitefly.', body: 'Remove infected plants early and control whitefly with soapy water or recommended products. Keep weeds and old crop debris down. Rotate away from okra and other malvaceous crops for at least two seasons.' },
  { seedKey: 'demo-pepper-thrips', title: 'Thrips and flower drop in chilli', category: 'pest', crop: 'pepper', summary: 'Curled leaves and scarred fruit signal thrips.', body: 'Inspect flowers and young leaves early in the morning. Use blue sticky traps where available, remove heavily infested shoots, and avoid over-fertilising with nitrogen. Keep plants well watered but not waterlogged.' },
  { seedKey: 'demo-sweet-potato-weevil', title: 'Sweet potato weevil and curing', category: 'storage', crop: 'sweet_potato', summary: 'Cure roots before storage and reject damaged ones.', body: 'Lift roots carefully to avoid cuts. Cure in a shaded, ventilated place for a few days, then store in a cool dry room. Remove roots with holes or rot. Rotate fields and avoid planting infected vines.' },
  { seedKey: 'demo-sesame-shatter', title: 'Harvest sesame before capsules shatter', category: 'storage', crop: 'sesame', summary: 'Timing protects the seed from loss.', body: 'Cut plants when lower capsules turn brown but before they open fully. Bundle and dry upright on a tarpaulin, then shake seed out. Dry seed well before bagging and store away from damp floors.' },
  { seedKey: 'demo-cowpea-bruchid', title: 'Protect cowpea from storage weevils', category: 'storage', crop: 'cowpea', summary: 'Bruchids can destroy a store in weeks.', body: 'Dry cowpea to low moisture, remove damaged grains, and store in clean sealed containers. Inspect monthly. Where available, use approved hermetic storage bags or a recommended protectant according to label directions.' },
  { seedKey: 'demo-watermelon-ripening', title: 'Watermelon ripening and fruit fly', category: 'general', crop: 'watermelon', summary: 'Reduce water at ripening and protect fruit.', body: 'Stop overhead irrigation as fruit ripens to improve sweetness and reduce splitting. Place fruit on dry straw or a clean board. Collect fallen or damaged fruit to reduce fruit-fly breeding.' },
  { seedKey: 'demo-papaya-drainage', title: 'Papaya roots need good drainage', category: 'disease', crop: 'papaya', summary: 'Standing water quickly rots papaya roots.', body: 'Plant on raised beds or mounds where soil drains slowly. Avoid planting in low spots during the rains. Stake plants that lean after wind and remove fruit-fly damaged fruit from the ground.' },
  { seedKey: 'demo-banana-suckers', title: 'Manage banana suckers and bunches', category: 'general', crop: 'banana', summary: 'Keep two or three strong suckers per mat.', body: 'Remove excess suckers so the mother plant and one or two followers can size well. Prop heavy bunches before they pull the stem over. Chop old stems and leaves and use them as mulch around the mat.' },
  { seedKey: 'demo-lime-leaf-miner', title: 'Citrus leaf miner on lime', category: 'pest', crop: 'lime', summary: 'Silver winding trails on young leaves.', body: 'Prune affected shoots on young trees and encourage natural enemies. Avoid excessive nitrogen flushes that attract the moth. Keep young trees watered through the dry season and mulch around the base.' },
  { seedKey: 'demo-cucumber-mildew', title: 'Downy mildew in cucumber', category: 'disease', crop: 'cucumber', summary: 'Angular yellow patches on leaves in humid weather.', body: 'Grow cucumbers on trellises for airflow, water at the base early in the day, and remove badly affected leaves. Avoid overcrowding. Rotate away from cucumber and other cucurbits.' },
  { seedKey: 'demo-moringa-harvest', title: 'Harvest moringa leaves for repeated cuts', category: 'general', crop: 'moringa', summary: 'Cut back regularly for tender leaves.', body: 'Harvest young shoots and leaves, leaving enough stem for regrowth. Avoid stripping the whole tree at once. Dry leaves in the shade to keep colour and nutrients, and store in airtight containers away from light.' },
  { seedKey: 'demo-tiger-nut-harvest', title: 'Lift and dry tiger nut after the rains', category: 'storage', crop: 'tiger_nut', summary: 'Wash, sort and dry tubers before sale.', body: 'Loosen soil and lift tubers when tops die back. Wash in clean water, remove damaged tubers, and dry in the shade before bagging. Store in a cool, ventilated place and check for mould.' },
];

const demoAlerts = [
  {
    seedKey: 'demo-north-bank-rain',
    type: 'weather',
    severity: 'urgent',
    region: REGIONS.NORTH_BANK,
    cropIds: ['groundnut', 'millet'],
    title: 'Heavy rain watch, North Bank',
    message: 'Several wet days expected. Delay spraying and cover drying groundnuts.',
  },
  {
    seedKey: 'demo-tomato-aphid',
    type: 'pest',
    severity: 'seasonal',
    region: REGIONS.WEST_COAST,
    cropIds: ['tomato', 'cabbage'],
    title: 'Aphid pressure on vegetables',
    message: 'Check undersides of tomato and cabbage leaves. Use soapy water early.',
  },
  {
    seedKey: 'demo-groundnut-price',
    type: 'market',
    severity: 'info',
    region: REGIONS.NORTH_BANK,
    cropIds: ['groundnut'],
    title: 'Groundnut prices firmer at Farafenni',
    message: 'Traders are paying more than last week. Compare before you sell to a middleman.',
  },
];

async function seed() {
  await connectDatabase();

  await Crop.deleteMany({});
  await Crop.insertMany(CROP_KNOWLEDGE);

  for (const demo of demoUsers) {
    const { password, ...profile } = demo;
    const passwordHash = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
      { email: profile.email },
      { ...profile, passwordHash },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const seededUsers = await User.find({ email: { $in: demoUsers.map((user) => user.email) } });
  const usersByEmail = new Map(seededUsers.map((user) => [user.email, user]));
  const farmer = usersByEmail.get('farmer@agriconnect.gm');
  const vendor = usersByEmail.get('vendor@agriconnect.gm');
  if (!farmer || !vendor) throw new Error('Marketplace demo accounts could not be loaded');

  await Promise.all(
    demoListings.map(({ seller, unit, ...listing }) => {
      const owner = usersByEmail.get(seller) || farmer;
      return Listing.updateOne(
        { seedKey: listing.seedKey },
        {
          $setOnInsert: {
            ...listing,
            owner: owner._id,
            farmerName: owner.name,
            farmerPhone: owner.phone,
            unit: unit || 'kg',
            availableFrom: new Date(),
            status: 'open',
          },
        },
        { upsert: true },
      );
    }),
  );
  await Promise.all(
    demoBuyRequests.map(({ buyer, unit, ...request }) => {
      const owner = usersByEmail.get(buyer) || vendor;
      return BuyRequest.updateOne(
        { seedKey: request.seedKey },
        {
          $setOnInsert: {
            ...request,
            owner: owner._id,
            buyerName: owner.name,
            buyerPhone: owner.phone,
            unit: unit || 'kg',
            neededBy: new Date(),
            status: 'open',
          },
        },
        { upsert: true },
      );
    }),
  );

  await Promise.all(
    demoMarkets.map((market) =>
      Market.updateOne({ slug: market.slug }, { $setOnInsert: market }, { upsert: true }),
    ),
  );
  const seededAt = Date.now();
  await Promise.all(
    demoPrices.flatMap(([crop, marketId, pricePerKg, previousPrice, history, source]) =>
      history.map((historicalPrice, index) =>
        MarketPrice.updateOne(
          { seedKey: `demo-${crop}-${marketId}-${index}` },
          {
            $setOnInsert: {
              seedKey: `demo-${crop}-${marketId}-${index}`,
              crop,
              marketId,
              pricePerKg: index === history.length - 1 ? pricePerKg : historicalPrice,
              previousPrice: index > 0 ? history[index - 1] : previousPrice,
              source: source || 'demo market survey',
              recordedAt: new Date(seededAt - (history.length - 1 - index) * 86400000),
            },
          },
          { upsert: true },
        ),
      ),
    ),
  );
  await Promise.all(
    demoAdvisories.map((advisory) =>
      Advisory.updateOne(
        { seedKey: advisory.seedKey },
        { $setOnInsert: advisory },
        { upsert: true },
      ),
    ),
  );

  const admin = await User.findOne({ email: 'admin@agriconnect.gm' });
  await Promise.all(
    demoAlerts.map((alert) =>
      Alert.updateOne(
        { title: alert.title, region: alert.region },
        { $setOnInsert: { ...alert, createdBy: admin?._id } },
        { upsert: true },
      ),
    ),
  );

  console.log(`Seeded crops, users, marketplace listings, markets, prices, advisories, and alerts.`);
  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('Seed failed', error);
  await disconnectDatabase();
  process.exit(1);
});
