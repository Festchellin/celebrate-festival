import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { shareApi } from '../../api';
import { Card } from '../../components/common/Card';
import { Event, EventType } from '../../types';
import { formatLunarDate } from '../../utils/lunar';
import { useTheme } from '../../context/ThemeContext';

const eventTypeConfig: Record<EventType, { color: string; bg: string; icon: string }> = {
  BIRTHDAY: { color: 'text-pink-500', bg: 'bg-pink-50', icon: '🎂' },
  ANNIVERSARY: { color: 'text-red-500', bg: 'bg-red-50', icon: '❤️' },
  FESTIVAL: { color: 'text-amber-500', bg: 'bg-amber-50', icon: '🏮' },
  CUSTOM: { color: 'text-purple-500', bg: 'bg-purple-50', icon: '📌' },
};

const eventTypeLabels: Record<EventType, string> = {
  BIRTHDAY: '生日',
  ANNIVERSARY: '纪念日',
  FESTIVAL: '传统节日',
  CUSTOM: '自定义',
};

export const SharePage = () => {
  const { token } = useParams<{ token: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (token) {
      loadSharedEvent(token);
    }
  }, [token]);

  const loadSharedEvent = async (shareToken: string) => {
    try {
      const res = await shareApi.getSharedEvent(shareToken);
      setEvent(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || '无法加载分享内容');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className={`w-12 h-12 border-4 ${isDark ? 'border-indigo-400' : 'border-indigo-500'} border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className={`w-20 h-20 ${isDark ? 'bg-red-900/50' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className="text-4xl">😢</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">无法查看</h2>
          <p className="text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const config = eventTypeConfig[event.type as EventType] || eventTypeConfig.CUSTOM;
  const { countdownDays, anniversary, isLunar, lunarMonth, lunarDay } = event;
  const isToday = countdownDays === 0;

  const formatCountdown = () => {
    if (countdownDays === 0) return { text: '就是今天!', className: 'text-green-500' };
    if (countdownDays > 0) return { text: `还有 ${countdownDays} 天`, className: 'text-indigo-600' };
    return { text: `已过去 ${Math.abs(countdownDays)} 天`, className: 'text-slate-400' };
  };

  const countdown = formatCountdown();
  const eventDate = new Date(event.date);
  
  const getFormattedDate = () => {
    if (isLunar && lunarMonth && lunarDay) {
      const lunarStr = formatLunarDate(lunarMonth, lunarDay);
      return event.isRecurring ? `每年${lunarStr}` : lunarStr;
    }
    if (event.isRecurring) {
      return `每年 ${eventDate.getMonth() + 1}月 ${eventDate.getDate()}日`;
    }
    return eventDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formattedDate = getFormattedDate();

  const formatAnniversary = (n: number, type: EventType) => {
    const suffix = type === 'BIRTHDAY' ? '周岁' : '周年';
    if (n === 1) return `一${suffix}`;
    if (n === 2) return `二${suffix}`;
    if (n === 3) return `三${suffix}`;
    if (n === 4) return `四${suffix}`;
    if (n === 5) return `五${suffix}`;
    if (n < 10) return `${n}${suffix}`;
    if (n < 20) return `${n}${suffix}`;
    if (n < 30) return `${n}${suffix}`;
    return `${n}${suffix}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDark ? 'bg-purple-900/20' : 'bg-purple-200/30'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-200/30'} rounded-full blur-3xl`} />
      </div>

      <div className="relative w-full max-w-md page-enter">
        <Card className={`text-center relative overflow-hidden ${isToday ? 'celebration-card' : ''}`}>
          {isToday && (
            <>
              <div className="confetti confetti-1" />
              <div className="confetti confetti-2" />
              <div className="confetti confetti-3" />
              <div className="confetti confetti-4" />
              <div className="confetti confetti-5" />
              <div className="confetti confetti-6" />
              <div className="confetti confetti-7" />
              <div className="confetti confetti-8" />
              <div className="confetti confetti-9" />
            </>
          )}
          <div className={`absolute top-0 right-0 w-32 h-32 ${isToday ? (isDark ? 'bg-green-900/50' : 'bg-green-100') : (isDark ? config.bg.replace('bg-', 'bg-').replace('-50', '-900/50') : config.bg)} rounded-full -translate-y-1/2 translate-x-1/2 opacity-60`} />
          {isToday && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full -translate-y-1/2 translate-x-1/4 opacity-30 blur-xl" />
          )}
          
          <div className={`w-20 h-20 ${config.bg} dark:${config.bg.replace('-50', '-900/30')} rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg`}>
            <span className="icon-float">{config.icon}</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{event.title}</h1>
          
          <div className="flex justify-center gap-2 mb-4">
            <span className={`text-sm px-3 py-1 ${isToday ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600') : config.bg + ' ' + config.color} rounded-full font-medium`}>
              {eventTypeLabels[event.type as EventType]}
            </span>
            {isLunar && (
              <span className={`text-sm px-3 py-1 ${isDark ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600'} rounded-full font-medium`}>
                🌙 农历
              </span>
            )}
          </div>

          <p className="text-slate-500 dark:text-slate-400 mb-8">{formattedDate}</p>

          <div className={`py-8 border-y ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
            {isToday ? (
              <span className="text-6xl font-bold animate-bounce">
                🎉
              </span>
            ) : (
              <>
                <span className={`text-5xl font-bold count-animate ${countdown.className}`}>
                  {Math.abs(countdownDays)}
                </span>
                <p className="text-slate-500 dark:text-slate-400 mt-2">天</p>
              </>
            )}
            {event.isRecurring && anniversary !== null && anniversary > 0 && (
              <p className="text-lg font-medium text-amber-500 mt-2">
                🎉 {formatAnniversary(anniversary, event.type as EventType)}
              </p>
            )}
          </div>

          {event.description && (
            <p className="text-slate-600 dark:text-slate-300 mt-6">{event.description}</p>
          )}
        </Card>
      </div>
    </div>
  );
};
