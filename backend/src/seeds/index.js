import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { REGIONS, ROLES } from '../config/constants.js';
import { Crop } from '../models/Crop.js';
import { User } from '../models/User.js';
import { CROP_KNOWLEDGE } from '../services/cropKnowledge.js';

const demoUsers = [
  {
    name: 'Fatou Jallow',
    email: 'farmer@agriconnect.gm',
    password: 'Password123',
    role: ROLES.FARMER,
    region: REGIONS.NORTH_BANK,
    village: 'Farafenni',
    crops: ['groundnut', 'millet', 'rice'],
    farmSizeHectares: 2.5,
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

  console.log(`Seeded ${CROP_KNOWLEDGE.length} crops and ${demoUsers.length} users.`);
  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('Seed failed', error);
  await disconnectDatabase();
  process.exit(1);
});
