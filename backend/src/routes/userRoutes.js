import { Router } from 'express';
import { ROLES } from '../config/constants.js';
import { getMyProfile, listUsers, updateMyProfile, updateUserRole } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = Router();

router.use(authenticate);
router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);
router.get('/', authorize(ROLES.ADMIN, ROLES.EXTENSION_OFFICER), listUsers);
router.patch('/:id/role', authorize(ROLES.ADMIN), updateUserRole);

export default router;
