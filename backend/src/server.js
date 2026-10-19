import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`AgriConnect API listening on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start AgriConnect API', error);
  process.exit(1);
});
