import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  await connectDatabase();
  app.listen(env.port, '0.0.0.0', () => {
    console.log(`AgriConnect listening on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start AgriConnect API', error);
  process.exit(1);
});
