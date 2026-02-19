import { Router } from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/', authenticateToken, getEvents);
router.get('/:id', authenticateToken, getEvent);
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

export default router;
