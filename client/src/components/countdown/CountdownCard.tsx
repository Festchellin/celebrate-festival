import { Event, EventType } from '../../types';
import { Card } from '../common/Card';
import { formatLunarDate } from '../../utils/lunar';
import { useTheme } from '../../context/ThemeContext';

interface CountdownCardProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const eventTypeConfig: Record<EventType, { 
  color: string; 
  bg: string; 
  darkBg: string;
  icon: string; 
  gradient: string; 
  darkGradient: string;
  glowColor: string;
}> = {
  BIRTHDAY: { 
    color: 'text-pink-500 dark:text-pink-400', 
    bg: 'bg-pink-50', 
    darkBg: 'bg-pink-500/20',
    icon: '🎂', 
    gradient: 'from-pink-400 to-rose-400',
    darkGradient: 'from-pink-500/30 to-rose-500/30',
    glowColor: 'rgba(236, 72, 153, 0.3)'
  },
  ANNIVERSARY: { 
    color: 'text-red-500 dark:text-red-400', 
    bg: 'bg-red-50',
    darkBg: 'bg-red-500/20', 
    icon: '❤️', 
    gradient: 'from-red-400 to-pink-400',
    darkGradient: 'from-red-500/30 to-pink-500/30',
    glowColor: 'rgba(239, 68, 68, 0.3)'
  },
  FESTIVAL: { 
    color: 'text-amber-500 dark:text-amber-400', 
    bg: 'bg-amber-50',
    darkBg: 'bg-amber-500/20', 
    icon: '🏮', 
    gradient: 'from-amber-400 to-orange-400',
    darkGradient: 'from-amber-500/30 to-orange-500/30',
    glowColor: 'rgba(245, 158, 11, 0.3)'
  },
  CUSTOM: { 
    color: 'text-purple-500 dark:text-purple-400', 
    bg: 'bg-purple-50',
    darkBg: 'bg-purple-500/20', 
    icon: '📌', 
    gradient: 'from-purple-400 to-violet-400',
    darkGradient: 'from-purple-500/30 to-violet-500/30',
    glowColor: 'rgba(139, 92, 246, 0.3)'
  },
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
  const { themeColor, themeMode } = useTheme();
  const config = eventTypeConfig[event.type as EventType] || eventTypeConfig.CUSTOM;
  const { countdownDays, anniversary, isLunar, lunarMonth, lunarDay } = event;
  const isToday = countdownDays === 0;
  const isDark = themeMode === 'dark';

  const formatCountdown = () => {
    if (countdownDays === 0) return { text: '就是今天!', className: 'text-green-500 dark:text-green-400' };
    if (countdownDays > 0) return { text: `还有 ${countdownDays} 天`, className: isDark ? 'text-indigo-400' : 'text-indigo-600' };
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
    <Card 
      glow={isToday} 
      className={`relative overflow-hidden liquid-card transition-all duration-300 hover:shadow-2xl ${
        isToday ? 'celebration-card' : ''
      }`}
      style={isDark && !isToday ? {
        boxShadow: `0 4px 20px -5px ${config.glowColor}`
      } : undefined}
    >
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
      
      {/* 深色模式装饰光晕 */}
      {isDark && !isToday && (
        <div 
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: config.glowColor }}
        />
      )}
      
      {/* 装饰 orb */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${
        isToday 
          ? 'bg-green-100 dark:bg-green-900/50' 
          : isDark 
            ? config.darkBg 
            : config.bg
      } rounded-full -translate-y-1/2 translate-x-1/2 opacity-40 liquid-orb-float`} />
      <div className={`absolute top-0 right-0 w-24 h-24 ${
        isToday 
          ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
          : isDark 
            ? `bg-gradient-to-br ${config.darkGradient}`
            : `bg-gradient-to-br ${config.gradient}`
      } rounded-full -translate-y-1/2 translate-x-1/4 opacity-30 blur-xl liquid-orb-float-delayed`} />
      
      <div className="flex items-start gap-4 relative z-10">
        {/* 图标 */}
        <div 
          className={`relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg ${
            isToday 
              ? 'bg-green-100 dark:bg-green-900/50' 
              : isDark 
                ? config.darkBg 
                : config.bg
          } ${isToday ? 'celebration-icon' : 'liquid-icon-container'}`}
        >
          <span className={isToday ? '' : 'icon-float'}>
            {isToday ? eventTypeIcons[event.type as EventType] || '🎉' : config.icon}
          </span>
          <div className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-br ${
            isDark ? config.darkGradient : config.gradient
          } opacity-0 hover:opacity-20 transition-opacity duration-500`} />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* 标题和标签 */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`font-semibold text-lg truncate ${
              isToday 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-slate-800 dark:text-white'
            }`}>
              {event.title}
            </h3>
            <span className={`text-xs px-3 py-1 rounded-full font-medium liquid-badge ${
              isToday 
                ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
                : `${config.bg} ${isDark ? 'dark:bg-slate-700/80' : ''} ${config.color}`
            }`}>
              {eventTypeLabels[event.type as EventType]}
            </span>
            {isLunar && (
              <span className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full font-medium liquid-badge">
                🌙 农历
              </span>
            )}
          </div>
          
          {/* 日期 */}
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{formattedDate}</p>
          
          {/* 倒计时 */}
          <div className="flex items-baseline gap-2 flex-wrap">
            {isToday ? (
              <span className="text-5xl font-bold liquid-celebration">
                🎉
              </span>
            ) : (
              <>
                <span 
                  className="text-4xl font-bold count-animate liquid-count"
                  style={{ 
                    color: countdownDays > 0 ? themeColor : undefined,
                    background: countdownDays > 0 ? 'transparent' : undefined,
                    WebkitBackgroundClip: countdownDays > 0 ? 'text' : undefined,
                    WebkitTextFillColor: countdownDays > 0 ? themeColor : undefined,
                  }}
                >
                  {Math.abs(countdownDays)}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{countdownDays === 0 ? '' : '天'}</span>
              </>
            )}
            {event.isRecurring && anniversary !== null && anniversary > 0 && (
              <span className="text-sm px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 text-amber-600 dark:text-amber-400 rounded-full font-medium badge-shine liquid-badge">
                🎉 {formatAnniversary(anniversary, event.type as EventType)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100/80 dark:border-slate-700/80">
        {onEdit && (
          <button 
            onClick={onEdit} 
            className="text-sm text-slate-500 dark:text-slate-400 hover:transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-xl liquid-button-small"
            style={{ color: themeColor }}
          >
            ✏️ 编辑
          </button>
        )}
        {onShare && (
          <button 
            onClick={onShare} 
            className="text-sm text-slate-500 dark:text-slate-400 hover:transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-xl liquid-button-small"
            style={{ color: themeColor }}
          >
            📤 分享
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete} 
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 hover:scale-105 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 ml-auto liquid-button-small"
          >
            🗑️ 删除
          </button>
        )}
      </div>
    </Card>
  );
};
