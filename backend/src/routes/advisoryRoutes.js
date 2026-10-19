import { Router } from 'express';
import { ROLES } from '../config/constants.js';
import { createAdvisory, getAdvisory, listAdvisories } from '../controllers/advisoryController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const cropSlugs = ['groundnut', 'rice', 'millet', 'maize', 'sorghum', 'cassava', 'onion', 'tomato', 'cabbage', 'mango', 'cashew'];

router.get('/', listAdvisories);
router.get('/:id', getAdvisory);
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.EXTENSION_OFFICER),
  validate({
    title: { required: true, type: 'string', minLength: 2 },
    category: { required: true, enum: ['pest', 'disease', 'soil', 'storage', 'general'] },
    crop: { enum: cropSlugs },
    language: { type: 'string' },
    summary: { required: true, type: 'string', minLength: 2 },
    body: { required: true, type: 'string', minLength: 2 },
  }),
  createAdvisory,
);

export default router;
