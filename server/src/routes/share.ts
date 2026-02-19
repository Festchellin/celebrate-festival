import { Router } from 'express';
import { createShareLink, getSharedEvent } from '../controllers/shareController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/', authenticateToken, createShareLink);
router.get('/:token', getSharedEvent);

export default router;
