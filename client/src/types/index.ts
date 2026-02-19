export interface User {
  id: number;
  username: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
  role?: string;
  createdAt?: string;
}

export interface Event {
  id: number;
  userId: number;
  title: string;
  date: string;
  type: EventType;
  description: string | null;
  isRecurring: boolean;
  remindDays: number | null;
  isLunar: boolean;
  lunarMonth: number | null;
  lunarDay: number | null;
  createdAt: string;
  updatedAt: string;
  countdownDays: number;
  anniversary: number | null;
  targetDate: string;
}

export type EventType = 'BIRTHDAY' | 'ANNIVERSARY' | 'FESTIVAL' | 'CUSTOM';

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}
