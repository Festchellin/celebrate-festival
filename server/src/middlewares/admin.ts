import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};
