import { Response } from 'express';
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

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { type } = req.query;

    const where: any = { userId };
    if (type && type !== 'ALL') {
      where.type = type;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const eventsWithCountdown = events.map((event) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
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
        const eventDateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        
        if (eventDateOnly < today) {
          anniversary = null;
        }
      }

      const targetDateDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
      const diffTime = targetDateDay.getTime() - today.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...event,
        countdownDays: diffDays,
        anniversary,
        targetDate: targetDate.toISOString(),
      };
    });

    eventsWithCountdown.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return Math.abs(a.countdownDays) - Math.abs(b.countdownDays);
    });

    res.json(eventsWithCountdown);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const event = await prisma.event.findFirst({
      where: { id: parseInt(id as string), userId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

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
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, date, type, description, isRecurring, isPinned, remindDays, isLunar, lunarMonth, lunarDay } = req.body;

    if (!title || !date || !type) {
      return res.status(400).json({ error: 'Title, date, and type are required' });
    }

    const event = await prisma.event.create({
      data: {
        userId,
        title: title as string,
        date: new Date(date as string),
        type: type as string,
        description: description as string | undefined,
        isRecurring: Boolean(isRecurring),
        isPinned: Boolean(isPinned),
        remindDays: remindDays as number | undefined,
        isLunar: Boolean(isLunar),
        lunarMonth: lunarMonth as number | undefined,
        lunarDay: lunarDay as number | undefined,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { title, date, type, description, isRecurring, isPinned, remindDays, isLunar, lunarMonth, lunarDay } = req.body;

    const existingEvent = await prisma.event.findFirst({
      where: { id: parseInt(id as string), userId },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = await prisma.event.update({
      where: { id: parseInt(id as string) },
      data: {
        title: title as string | undefined,
        date: date ? new Date(date as string) : undefined,
        type: type as string | undefined,
        description: description as string | undefined,
        isRecurring: isRecurring as boolean | undefined,
        isPinned: isPinned as boolean | undefined,
        remindDays: remindDays as number | undefined,
        isLunar: isLunar as boolean | undefined,
        lunarMonth: lunarMonth as number | undefined,
        lunarDay: lunarDay as number | undefined,
      },
    });

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existingEvent = await prisma.event.findFirst({
      where: { id: parseInt(id as string), userId },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await prisma.event.delete({
      where: { id: parseInt(id as string) },
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
