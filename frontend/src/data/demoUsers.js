import { readJson, writeJson } from '../utils/storage.js';

const DEMO_PASSWORD = 'Password123';

const SEEDED_USERS = [
  {
    id: 'demo-farmer',
    name: 'Fatou Jallow',
    email: 'farmer@agriconnect.gm',
    role: 'farmer',
    phone: '+220 300 1001',
    region: 'north_bank',
    village: 'Farafenni',
    crops: ['groundnut', 'millet', 'rice'],
    farmSizeHectares: 2.5,
    farmingType: 'rainfed',
    language: 'en',
    privacy: { showPhoneOnListings: true },
  },
  {
    id: 'demo-extension',
    name: 'Lamin Ceesay',
    email: 'extension@agriconnect.gm',
    role: 'extension_officer',
    phone: '',
    region: 'west_coast',
    village: 'Brikama',
    crops: ['onion', 'tomato'],
    language: 'en',
    privacy: { showPhoneOnListings: true },
  },
  {
    id: 'demo-vendor',
    name: 'Awa Touray',
    email: 'vendor@agriconnect.gm',
    role: 'vendor',
    phone: '+220 200 2001',
    region: 'kanifing',
    village: 'Serrekunda',
    crops: ['onion', 'tomato', 'cabbage'],
    language: 'en',
    privacy: { showPhoneOnListings: true },
  },
  {
    id: 'demo-admin',
    name: 'Admin User',
    email: 'admin@agriconnect.gm',
    role: 'admin',
    phone: '',
    region: 'banjul',
    crops: [],
    language: 'en',
    privacy: { showPhoneOnListings: true },
  },
];

function savedUsers() {
  return readJson('demoUsers', []);
}

function publicUser(user) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function allUsers() {
  const saved = savedUsers();
  const savedByEmail = new Map(saved.map((user) => [user.email.toLowerCase(), user]));
  return [
    ...SEEDED_USERS.map((user) => savedByEmail.get(user.email) || user),
    ...saved.filter((user) => !SEEDED_USERS.some((seed) => seed.email === user.email)),
  ];
}

async function passwordHash(password) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Demo registration requires a secure browser context (HTTPS or localhost).');
  }
  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function listDemoUsers() {
  return allUsers().map(publicUser);
}

export async function loginDemoUser({ email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = allUsers().find((entry) => entry.email.toLowerCase() === normalizedEmail);
  if (!user) throw new Error('Invalid email or password');

  const validPassword = user.passwordHash
    ? user.passwordHash === (await passwordHash(password))
    : password === DEMO_PASSWORD;
  if (!validPassword) throw new Error('Invalid email or password');

  const safeUser = publicUser(user);
  return { success: true, data: { token: `demo-${user.id}`, user: safeUser } };
}

export async function registerDemoUser(payload) {
  const email = String(payload.email || '').trim().toLowerCase();
  if (allUsers().some((user) => user.email.toLowerCase() === email)) {
    throw new Error('An account with that email already exists');
  }
  if (payload.phone && allUsers().some((user) => user.phone === payload.phone)) {
    throw new Error('An account with that phone number already exists');
  }
  if (!['farmer', 'vendor'].includes(payload.role || 'farmer')) {
    throw new Error('That role cannot be self-assigned');
  }

  const user = {
    ...payload,
    id: `demo-user-${Date.now()}`,
    email,
    role: payload.role || 'farmer',
    crops: payload.crops || [],
    language: payload.language || 'en',
    privacy: payload.privacy || { showPhoneOnListings: true },
    passwordHash: await passwordHash(payload.password),
  };
  writeJson('demoUsers', [...savedUsers(), user]);
  const safeUser = publicUser(user);
  return { success: true, data: { token: `demo-${user.id}`, user: safeUser } };
}

export function updateDemoProfile(userId, changes) {
  const user = allUsers().find((entry) => entry.id === userId);
  if (!user) throw new Error('User not found');
  const updatedUser = { ...user, ...changes, id: userId };
  if (SEEDED_USERS.some((seed) => seed.id === userId)) {
    const saved = savedUsers().filter((entry) => entry.id !== userId);
    writeJson('demoUsers', [...saved, updatedUser]);
  } else {
    writeJson(
      'demoUsers',
      savedUsers().map((entry) => (entry.id === userId ? updatedUser : entry)),
    );
  }
  return publicUser(updatedUser);
}

export function updateDemoRole(userId, role) {
  if (!['farmer', 'vendor', 'extension_officer', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }
  const user = allUsers().find((entry) => entry.id === userId);
  if (!user) throw new Error('User not found');
  const updatedUser = { ...user, role };
  const saved = savedUsers().filter((entry) => entry.id !== userId);
  writeJson('demoUsers', [...saved, updatedUser]);
  return publicUser(updatedUser);
}
