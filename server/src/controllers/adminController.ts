import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        createdAt: true,
        _count: {
          select: { events: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    const { role } = req.body;
    
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true
      }
    });
    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const getAllEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const eventId = parseInt(req.params.id as string);
    await prisma.event.delete({ where: { id: eventId } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
