import dotenv from 'dotenv';

dotenv.config();

export function loadEnv() {
  const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    databaseUrl: process.env.DATABASE_URL || process.env.MONGODB_URI || process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  };

  if (env.nodeEnv === 'production') {
    const missing = [];
    if (!env.databaseUrl) {
      missing.push('DATABASE_URL (or MONGODB_URI/MONGO_URI)');
    }
    if (!env.jwtSecret) {
      missing.push('JWT_SECRET');
    }
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
