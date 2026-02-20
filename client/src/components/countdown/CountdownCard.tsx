import { Event, EventType } from '../../types';
import { Card } from '../common/Card';
import { formatLunarDate } from '../../utils/lunar';

interface CountdownCardProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const eventTypeConfig: Record<EventType, { color: string; bg: string; icon: string; gradient: string; liquidGradient: string }> = {
  BIRTHDAY: { color: 'text-pink-500', bg: 'bg-pink-50', icon: '🎂', gradient: 'from-pink-400 to-rose-400', liquidGradient: 'from-pink-400/20 via-rose-400/10 to-transparent' },
  ANNIVERSARY: { color: 'text-red-500', bg: 'bg-red-50', icon: '❤️', gradient: 'from-red-400 to-pink-400', liquidGradient: 'from-red-400/20 via-pink-400/10 to-transparent' },
  FESTIVAL: { color: 'text-amber-500', bg: 'bg-amber-50', icon: '🏮', gradient: 'from-amber-400 to-orange-400', liquidGradient: 'from-amber-400/20 via-orange-400/10 to-transparent' },
  CUSTOM: { color: 'text-purple-500', bg: 'bg-purple-50', icon: '📌', gradient: 'from-purple-400 to-violet-400', liquidGradient: 'from-purple-400/20 via-violet-400/10 to-transparent' },
};

const eventTypeLabels: Record<EventType, string> = {
  BIRTHDAY: '生日',
  ANNIVERSARY: '纪念日',
  FESTIVAL: '传统节日',
  CUSTOM: '自定义',
};

const eventTypeIcons: Record<EventType, string> = {
  BIRTHDAY: '🎂',
  ANNIVERSARY: '🎉',
  FESTIVAL: '🏮',
  CUSTOM: '🎊',
};

export const CountdownCard = ({ event, onEdit, onDelete, onShare }: CountdownCardProps) => {
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
      return event.isRecurring ? `每年${lunarStr}` : `${lunarStr}`;
    }
    if (event.isRecurring) {
      return `每年 ${eventDate.getMonth() + 1 }月 ${eventDate.getDate()}日`;
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
    <Card glow={isToday} className={`relative overflow-hidden liquid-card ${isToday ? 'celebration-card' : ''}`}>
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
      
      {/* Liquid orbs for decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${isToday ? 'bg-green-100' : config.bg} rounded-full -translate-y-1/2 translate-x-1/2 opacity-40 liquid-orb-float`} />
      <div className={`absolute top-0 right-0 w-24 h-24 ${isToday ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br ' + config.gradient} rounded-full -translate-y-1/2 translate-x-1/4 opacity-30 blur-xl liquid-orb-float-delayed`} />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className={`relative w-16 h-16 ${isToday ? 'bg-green-100' : config.bg} rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg ${isToday ? 'celebration-icon' : 'liquid-icon-container'}`}>
          <span className={isToday ? '' : 'icon-float'}>
            {isToday ? eventTypeIcons[event.type as EventType] || '🎉' : config.icon}
          </span>
          <div className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-br ${config.gradient} opacity-0 hover:opacity-20 transition-opacity duration-500`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`font-semibold text-lg truncate ${isToday ? 'text-green-600' : 'text-slate-800'}`}>
              {event.title}
            </h3>
            <span className={`text-xs px-3 py-1 ${isToday ? 'bg-green-100 text-green-600' : config.bg + ' ' + config.color} rounded-full font-medium liquid-badge`}>
              {eventTypeLabels[event.type as EventType]}
            </span>
            {isLunar && (
              <span className="text-xs px-3 py-1 bg-amber-100 text-amber-600 rounded-full font-medium liquid-badge">
                🌙 农历
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-500 mb-3">{formattedDate}</p>
          
          <div className="flex items-baseline gap-2 flex-wrap">
            {isToday ? (
              <span className="text-5xl font-bold liquid-celebration">
                🎉
              </span>
            ) : (
              <>
                <span className={`text-4xl font-bold count-animate liquid-count ${countdown.className}`}>
                  {Math.abs(countdownDays)}
                </span>
                <span className="text-slate-500">{countdownDays === 0 ? '' : '天'}</span>
              </>
            )}
            {event.isRecurring && anniversary !== null && anniversary > 0 && (
              <span className="text-sm px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 rounded-full font-medium badge-shine liquid-badge">
                🎉 {formatAnniversary(anniversary, event.type as EventType)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100/80">
        {onEdit && (
          <button onClick={onEdit} className="text-sm text-slate-500 hover:text-indigo-500 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-xl hover:bg-indigo-50 liquid-button-small">
            ✏️ 编辑
          </button>
        )}
        {onShare && (
          <button onClick={onShare} className="text-sm text-slate-500 hover:text-indigo-500 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-xl hover:bg-indigo-50 liquid-button-small">
            📤 分享
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-sm text-slate-500 hover:text-red-500 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-xl hover:bg-red-50 ml-auto liquid-button-small">
            🗑️ 删除
          </button>
        )}
      </div>
    </Card>
  );
};
