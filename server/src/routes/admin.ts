import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/admin';
import { 
  getAllUsers, 
  deleteUser, 
  updateUserRole, 
  getAllEvents, 
  deleteEvent 
} from '../controllers/adminController';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/events', getAllEvents);
router.delete('/events/:id', deleteEvent);

export default router;
