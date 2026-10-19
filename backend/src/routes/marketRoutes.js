import { Router } from 'express';
import { ROLES } from '../config/constants.js';
import { comparePrices, getMarket, getPriceHistory, getPrices, listMarkets, submitPrice } from '../controllers/marketController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const cropSlugs = ['groundnut', 'rice', 'millet', 'maize', 'sorghum', 'cassava', 'onion', 'tomato', 'cabbage', 'mango', 'cashew'];

router.get('/', listMarkets);
router.get('/prices', getPrices);
router.get('/compare', comparePrices);
router.get('/history', getPriceHistory);
router.post(
  '/prices',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.EXTENSION_OFFICER),
  validate({
    crop: { required: true, type: 'string', enum: cropSlugs },
    marketId: { required: true, type: 'string' },
    pricePerKg: { required: true, type: 'number', min: 1 },
    note: { type: 'string' },
  }),
  submitPrice,
);
router.get('/:id', getMarket);

export default router;
