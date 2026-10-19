import { Router } from 'express';
import { REGIONS, ROLES } from '../config/constants.js';
import { createAlert, listAlerts } from '../controllers/alertController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', listAlerts);
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.EXTENSION_OFFICER),
  validate({
    type: { required: true, enum: ['weather', 'pest', 'market'] },
    severity: { required: true, enum: ['urgent', 'seasonal', 'info'] },
    region: { required: true, enum: Object.values(REGIONS) },
    title: { required: true, type: 'string', minLength: 2 },
    message: { required: true, type: 'string', minLength: 2 },
  }),
  createAlert,
);

export default router;
