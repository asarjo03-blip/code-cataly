import { Router } from 'express';
import { getCropCalendarHandler, getCurrentCalendar, listCropsPublic } from '../controllers/cropController.js';

const router = Router();
router.get('/', listCropsPublic);
router.get('/calendar/current', getCurrentCalendar);
router.get('/:id/calendar', getCropCalendarHandler);

export default router;
