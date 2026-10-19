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
];

const demoListings = [
  { seedKey: 'demo-groundnut', crop: 'groundnut', quantity: 500, askingPrice: 46, region: REGIONS.NORTH_BANK, village: 'Farafenni', notes: 'Well dried, ready for traders.' },
  { seedKey: 'demo-onion', crop: 'onion', quantity: 200, askingPrice: 50, region: REGIONS.WEST_COAST, village: 'Brikama', notes: 'Irrigated dry-season onions.' },
  { seedKey: 'demo-tomato', crop: 'tomato', quantity: 80, askingPrice: 38, region: REGIONS.KANIFING, village: 'Serrekunda', notes: 'Fresh pick this morning.' },
  { seedKey: 'demo-mango', crop: 'mango', quantity: 120, askingPrice: 20, region: REGIONS.WEST_COAST, village: 'Gunjur', notes: 'Kent variety, export grade.' },
  { seedKey: 'demo-rice', crop: 'rice', quantity: 300, askingPrice: 34, region: REGIONS.LOWER_RIVER, village: 'Soma', notes: 'Local paddy, clean bags.' },
  { seedKey: 'demo-millet', crop: 'millet', quantity: 250, askingPrice: 27, region: REGIONS.CENTRAL_RIVER_SOUTH, village: 'Janjanbureh', notes: 'Early millet harvest.' },
];

const demoBuyRequests = [
  { seedKey: 'demo-groundnut-request', crop: 'groundnut', quantity: 1000, offerPrice: 47, region: REGIONS.NORTH_BANK, notes: 'Collecting for Serrekunda wholesale.' },
  { seedKey: 'demo-tomato-request', crop: 'tomato', quantity: 50, offerPrice: 42, region: REGIONS.KANIFING, notes: 'Weekly hotel kitchen order.' },
  { seedKey: 'demo-onion-request', crop: 'onion', quantity: 150, offerPrice: 49, region: REGIONS.WEST_COAST, notes: 'Bulk for canteens.' },
];

const demoMarkets = [
  { slug: 'serrekunda', name: 'Serrekunda Market', region: REGIONS.KANIFING, location: 'Serrekunda', marketDays: ['Mon', 'Wed', 'Fri', 'Sat'], cropsTraded: ['onion', 'tomato', 'cabbage', 'mango', 'groundnut'], note: 'Busy peri-urban wholesale hub.' },
  { slug: 'brikama', name: 'Brikama Market', region: REGIONS.WEST_COAST, location: 'Brikama', marketDays: ['Tue', 'Thu', 'Sat'], cropsTraded: ['groundnut', 'cassava', 'mango', 'cashew', 'tomato'], note: 'Strong demand from hotels and traders.' },
  { slug: 'farafenni', name: 'Farafenni Market', region: REGIONS.NORTH_BANK, location: 'Farafenni', marketDays: ['Wed', 'Sat'], cropsTraded: ['groundnut', 'millet', 'maize', 'sorghum', 'onion'], note: 'Key North Bank cash-crop market.' },
  { slug: 'basse', name: 'Basse Market', region: REGIONS.UPPER_RIVER, location: 'Basse', marketDays: ['Mon', 'Thu'], cropsTraded: ['groundnut', 'millet', 'sorghum', 'rice', 'cashew'], note: 'Upper River Region trading centre.' },
  { slug: 'soma', name: 'Soma Market', region: REGIONS.LOWER_RIVER, location: 'Soma', marketDays: ['Tue', 'Fri'], cropsTraded: ['rice', 'groundnut', 'cassava', 'onion', 'tomato'], note: 'Transit point between upcountry and coast.' },
];

const demoPrices = [
  ['groundnut', 'farafenni', 48, 44, [38, 40, 41, 43, 44, 46, 48]],
  ['groundnut', 'brikama', 45, 46, [42, 43, 44, 45, 46, 45, 45]],
  ['groundnut', 'serrekunda', 50, 47, [40, 42, 44, 45, 47, 48, 50]],
  ['groundnut', 'basse', 42, 41, [36, 37, 38, 39, 40, 41, 42]],
  ['groundnut', 'soma', 44, 43, [38, 39, 40, 41, 42, 43, 44]],
  ['onion', 'serrekunda', 55, 60, [62, 61, 60, 58, 57, 56, 55]],
  ['onion', 'brikama', 52, 54, [58, 56, 55, 54, 53, 52, 52]],
  ['onion', 'farafenni', 48, 50, [54, 53, 52, 51, 50, 49, 48]],
  ['tomato', 'serrekunda', 40, 38, [32, 33, 35, 36, 37, 38, 40]],
  ['tomato', 'brikama', 38, 39, [34, 35, 36, 37, 39, 38, 38]],
  ['millet', 'farafenni', 28, 27, [24, 25, 25, 26, 27, 27, 28]],
  ['millet', 'basse', 26, 26, [23, 24, 24, 25, 25, 26, 26]],
  ['rice', 'soma', 35, 34, [30, 31, 32, 33, 34, 34, 35]],
  ['rice', 'basse', 33, 32, [29, 30, 30, 31, 32, 32, 33]],
  ['mango', 'brikama', 22, 20, [16, 17, 18, 19, 20, 21, 22]],
  ['mango', 'serrekunda', 25, 23, [18, 19, 20, 21, 22, 23, 25]],
  ['cassava', 'brikama', 18, 18, [16, 16, 17, 17, 18, 18, 18]],
  ['cabbage', 'serrekunda', 30, 32, [34, 33, 32, 32, 31, 30, 30]],
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

  const farmer = await User.findOne({ email: 'farmer@agriconnect.gm' });
  const vendor = await User.findOne({ email: 'vendor@agriconnect.gm' });
  if (!farmer || !vendor) throw new Error('Marketplace demo accounts could not be loaded');

  await Promise.all(
    demoListings.map((listing) =>
      Listing.updateOne(
        { seedKey: listing.seedKey },
        {
          $setOnInsert: {
            ...listing,
            owner: farmer._id,
            farmerName: farmer.name,
            farmerPhone: farmer.phone,
            unit: 'kg',
            availableFrom: new Date(),
            status: 'open',
          },
        },
        { upsert: true },
      ),
    ),
  );
  await Promise.all(
    demoBuyRequests.map((request) =>
      BuyRequest.updateOne(
        { seedKey: request.seedKey },
        {
          $setOnInsert: {
            ...request,
            owner: vendor._id,
            buyerName: vendor.name,
            buyerPhone: vendor.phone,
            unit: 'kg',
            neededBy: new Date(),
            status: 'open',
          },
        },
        { upsert: true },
      ),
    ),
  );

  await Promise.all(
    demoMarkets.map((market) =>
      Market.updateOne({ slug: market.slug }, { $setOnInsert: market }, { upsert: true }),
    ),
  );
  const seededAt = Date.now();
  await Promise.all(
    demoPrices.flatMap(([crop, marketId, pricePerKg, previousPrice, history]) =>
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
              source: 'demo',
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
