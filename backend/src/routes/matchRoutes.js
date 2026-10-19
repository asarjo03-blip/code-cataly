import { Router } from 'express';
import { getMatches } from '../controllers/matchController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.get('/', authenticate, getMatches);

export default router;
