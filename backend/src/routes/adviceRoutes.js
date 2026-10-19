import { Router } from 'express';
import { generateAdviceHandler, getAdvice, getCrops } from '../controllers/adviceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/', getAdvice);
router.post('/generate', generateAdviceHandler);
router.get('/crops', getCrops);

export default router;
