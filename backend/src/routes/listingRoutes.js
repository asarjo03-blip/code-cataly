import { Router } from 'express';
import { REGIONS, ROLES } from '../config/constants.js';
import {
  createBuyRequest,
  createListing,
  deleteListing,
  getListing,
  listBuyRequests,
  listListings,
  listMyBuyRequests,
  listMyListings,
  updateListing,
} from '../controllers/listingController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';

const listingRouter = Router();
const buyRequestRouter = Router();
const cropSlugs = ['groundnut', 'rice', 'millet', 'maize', 'sorghum', 'cassava', 'onion', 'tomato', 'cabbage', 'mango', 'cashew'];
const listingFields = {
  crop: { required: true, type: 'string', enum: cropSlugs },
  quantity: { required: true, type: 'number', min: 1 },
  unit: { enum: ['kg', 'bag', 'crate'] },
  askingPrice: { required: true, type: 'number', min: 1 },
  region: { required: true, enum: Object.values(REGIONS) },
  village: { type: 'string' },
  availableFrom: { type: 'string' },
  notes: { type: 'string' },
};
const requestFields = {
  crop: { required: true, type: 'string', enum: cropSlugs },
  quantity: { required: true, type: 'number', min: 1 },
  unit: { enum: ['kg', 'bag', 'crate'] },
  offerPrice: { required: true, type: 'number', min: 1 },
  region: { required: true, enum: Object.values(REGIONS) },
  neededBy: { type: 'string' },
  notes: { type: 'string' },
};
const listingUpdateFields = {
  crop: { type: 'string', enum: cropSlugs },
  quantity: { type: 'number', min: 1 },
  unit: { enum: ['kg', 'bag', 'crate'] },
  askingPrice: { type: 'number', min: 1 },
  region: { enum: Object.values(REGIONS) },
  village: { type: 'string' },
  availableFrom: { type: 'string' },
  status: { enum: ['open', 'closed', 'sold'] },
  notes: { type: 'string' },
};

listingRouter.get('/', listListings);
listingRouter.get('/mine', authenticate, authorize(ROLES.FARMER, ROLES.ADMIN), listMyListings);
listingRouter.get('/:id', getListing);
listingRouter.post('/', authenticate, authorize(ROLES.FARMER, ROLES.ADMIN), validate(listingFields), createListing);
listingRouter.patch(
  '/:id',
  authenticate,
  authorize(ROLES.FARMER, ROLES.ADMIN),
  validate(listingUpdateFields),
  updateListing,
);
listingRouter.delete('/:id', authenticate, authorize(ROLES.FARMER, ROLES.ADMIN), deleteListing);

buyRequestRouter.get('/', listBuyRequests);
buyRequestRouter.get('/mine', authenticate, authorize(ROLES.VENDOR, ROLES.ADMIN), listMyBuyRequests);
buyRequestRouter.post('/', authenticate, authorize(ROLES.VENDOR, ROLES.ADMIN), validate(requestFields), createBuyRequest);

export { listingRouter, buyRequestRouter };
