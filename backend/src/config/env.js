import dotenv from 'dotenv';

dotenv.config();

const requiredInProduction = ['DATABASE_URL', 'JWT_SECRET'];

export function loadEnv() {
  const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    databaseUrl: process.env.DATABASE_URL || process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  };

  if (env.nodeEnv === 'production') {
    const missing = requiredInProduction.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  if (!env.jwtSecret) {
    env.jwtSecret = 'dev-only-insecure-secret';
  }

  if (!env.databaseUrl) {
    env.databaseUrl = 'mongodb://127.0.0.1:27017/agriconnect-gambia';
  }

  return env;
}

export const env = loadEnv();
