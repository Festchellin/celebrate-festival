import { Response } from 'express';
import { randomBytes } from 'crypto';
import { Lunar } from 'lunar-javascript';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';

const getNextLunarDate = (lunarMonth: number, lunarDay: number, year: number): Date => {
  try {
    const lunar = Lunar.fromYmd(year, lunarMonth, lunarDay);
    const solar = lunar.getSolar() as unknown as { getMonth(): number; getDay(): number };
    const month = solar.getMonth();
    const day = solar.getDay();
    return new Date(year, month - 1, day);
  } catch (e) {
    console.error('Lunar conversion error:', e);
    return new Date(year, 0, 1);
  }
};

export const createShareLink = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { eventId, expiresInDays } = req.body;

    const event = await prisma.event.findFirst({
      where: { id: eventId as number, userId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + ((expiresInDays as number) || 7));

    const shareLink = await prisma.shareLink.create({
      data: {
        eventId: eventId as number,
        token,
        expiresAt,
      },
    });

    res.status(201).json({
      shareUrl: `/share/${token}`,
      expiresAt: shareLink.expiresAt,
    });
  } catch (error) {
    console.error('Create share link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSharedEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;

    const shareLink = await prisma.shareLink.findUnique({
      where: { token: token as string },
      include: { event: true },
    });

    if (!shareLink) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    if (new Date() > shareLink.expiresAt) {
      return res.status(410).json({ error: 'Share link has expired' });
    }

    const event = shareLink.event as any;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let targetDate: Date;
    let anniversary: number | null = null;
    
    if (event.isLunar && event.lunarMonth && event.lunarDay) {
      const currentYear = now.getFullYear();
      const firstEventYear = new Date(event.date).getFullYear();
      
      targetDate = getNextLunarDate(event.lunarMonth, event.lunarDay, currentYear);
      
      if (targetDate < today) {
        anniversary = currentYear - firstEventYear;
        targetDate = getNextLunarDate(event.lunarMonth, event.lunarDay, currentYear + 1);
      } else if (targetDate.getFullYear() === today.getFullYear() && 
                 targetDate.getMonth() === today.getMonth() && 
                 targetDate.getDate() === today.getDate()) {
        anniversary = currentYear - firstEventYear + 1;
      } else {
        anniversary = currentYear - firstEventYear;
      }
    } else if (event.isRecurring) {
      const currentYear = now.getFullYear();
      const firstEventYear = new Date(event.date).getFullYear();
      const eventDate = new Date(event.date);
      
      targetDate = new Date(currentYear, eventDate.getMonth(), eventDate.getDate());
      
      if (targetDate < today) {
        anniversary = currentYear - firstEventYear;
        targetDate = new Date(currentYear + 1, eventDate.getMonth(), eventDate.getDate());
      } else if (targetDate.getFullYear() === today.getFullYear() && 
                 targetDate.getMonth() === today.getMonth() && 
                 targetDate.getDate() === today.getDate()) {
        anniversary = currentYear - firstEventYear + 1;
      } else {
        anniversary = currentYear - firstEventYear;
      }
    } else {
      targetDate = new Date(event.date);
    }

    const targetDateDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const diffTime = targetDateDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    res.json({
      ...event,
      countdownDays: diffDays,
      anniversary,
      targetDate: targetDate.toISOString(),
    });
  } catch (error) {
    console.error('Get shared event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
