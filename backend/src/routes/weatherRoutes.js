import { Router } from 'express';
import { getCurrentWeather } from '../controllers/weatherController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/', getCurrentWeather);

export default router;
