import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { PUBLIC_REGISTER_ROLES, REGIONS } from '../config/constants.js';
import { login, me, register } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Try again later.' },
});

router.post(
  '/register',
  authLimiter,
  validate({
    name: { required: true, type: 'string', minLength: 2 },
    email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, type: 'string', minLength: 8 },
    region: { required: true, enum: Object.values(REGIONS) },
    role: { enum: PUBLIC_REGISTER_ROLES },
  }),
  register,
);

router.post(
  '/login',
  authLimiter,
  validate({
    email: { required: true, type: 'string' },
    password: { required: true, type: 'string' },
  }),
  login,
);

router.get('/me', authenticate, me);

export default router;
