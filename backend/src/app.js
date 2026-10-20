import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import adviceRoutes from './routes/adviceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import { buyRequestRouter, listingRouter } from './routes/listingRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import matchRoutes from './routes/matchRoutes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_request, response) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  response.json({
    status: 'ok',
    database: states[mongoose.connection.readyState] || 'unknown',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/listings', listingRouter);
app.use('/api/buy-requests', buyRequestRouter);
app.use('/api/markets', marketRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/alerts', alertRoutes);

const frontendDist = fileURLToPath(new URL('../../frontend/dist/', import.meta.url));
if (env.nodeEnv === 'production' && existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api(?:\/|$)).*/, (_request, response, next) => {
    response.sendFile(fileURLToPath(new URL('../../frontend/dist/index.html', import.meta.url)), (error) => {
      if (error) next(error);
    });
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
