import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { eventApi } from '../../api';
import { EventType } from '../../types';
import { LUNAR_MONTHS, LUNAR_DAYS, lunarToSolar } from '../../utils/lunar';
import { useTheme } from '../../context/ThemeContext';

const BackgroundOrbs = () => (
  <div className="bg-animation">
    <div className="orb orb-1" />
    <div className="orb orb-2" />
    <div className="orb orb-3" />
    <div className="orb orb-4" />
  </div>
);

const eventTypes: { value: EventType; label: string; icon: string; gradient: string; activeGradient: string }[] = [
  { value: 'BIRTHDAY', label: '生日', icon: '🎂', gradient: 'from-pink-100 to-rose-100', activeGradient: 'from-pink-400 to-rose-400' },
  { value: 'ANNIVERSARY', label: '纪念日', icon: '❤️', gradient: 'from-red-100 to-pink-100', activeGradient: 'from-red-400 to-pink-400' },
  { value: 'FESTIVAL', label: '传统节日', icon: '🏮', gradient: 'from-amber-100 to-orange-100', activeGradient: 'from-amber-400 to-orange-400' },
  { value: 'CUSTOM', label: '自定义', icon: '📌', gradient: 'from-purple-100 to-violet-100', activeGradient: 'from-purple-400 to-violet-400' },
];

type DateMode = 'solar' | 'lunar';

const getSolarYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 100; i <= currentYear + 100; i++) {
    years.push({ value: i, label: `${i}年` });
  }
  return years;
};

const getSolarMonths = () => {
  return [
    { value: 1, label: '1月' }, { value: 2, label: '2月' }, { value: 3, label: '3月' },
    { value: 4, label: '4月' }, { value: 5, label: '5月' }, { value: 6, label: '6月' },
    { value: 7, label: '7月' }, { value: 8, label: '8月' }, { value: 9, label: '9月' },
    { value: 10, label: '10月' }, { value: 11, label: '11月' }, { value: 12, label: '12月' },
  ];
};

const getSolarDays = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ value: i, label: `${i}日` });
  }
  return days;
};

const getLunarYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 100; i <= currentYear + 100; i++) {
    years.push({ value: i, label: `${i}年` });
  }
  return years;
};

const LiquidSelect = ({ 
  value, 
  onChange, 
  options, 
  label,
  colorClass = 'indigo'
}: { 
  value: number; 
  onChange: (value: number) => void; 
  options: { value: number; label: string }[];
  label: string;
  colorClass?: 'indigo' | 'amber';
}) => {
  const colorMap = {
    indigo: {
      border: 'border-slate-200',
      focus: 'focus:ring-indigo-400/50 focus:border-indigo-300',
      gradient: 'from-indigo-400 to-blue-400'
    },
    amber: {
      border: 'border-slate-200',
      focus: 'focus:ring-amber-400/50 focus:border-amber-300',
      gradient: 'from-amber-400 to-orange-400'
    }
  };
  const colors = colorMap[colorClass];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2 liquid-label">
        {label}
      </label>
      <div className="relative liquid-select-wrapper">
        <select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full px-5 py-3.5 rounded-2xl border ${colors.border} bg-white/80 backdrop-blur-sm text-slate-800 appearance-none cursor-pointer transition-all duration-500 liquid-select ${colors.focus}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="liquid-select-glow" style={{ 
          background: colorClass === 'indigo' 
            ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' 
            : 'linear-gradient(135deg, #F59E0B, #EF4444)' 
        }} />
      </div>
    </div>
  );
};

const LiquidCheckbox = ({ 
  checked, 
  onChange, 
  label 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  label: string;
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer liquid-checkbox-wrapper">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div 
          className={`w-12 h-7 rounded-full transition-all duration-500 liquid-checkbox ${
            checked 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
              : 'bg-slate-200'
          }`}
        >
          <div 
            className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 ${
              checked ? 'left-6' : 'left-1'
            }`}
          />
        </div>
        {checked && <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-indigo-400" />}
      </div>
      <span className="text-sm text-slate-600">{label}</span>
    </label>
  );
};

export const AddEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { themeColor } = useTheme();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('CUSTOM');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>('solar');
  
  const [solarYear, setSolarYear] = useState(new Date().getFullYear());
  const [solarMonth, setSolarMonth] = useState(new Date().getMonth() + 1);
  const [solarDay, setSolarDay] = useState(new Date().getDate());
  
  const [lunarYear, setLunarYear] = useState(new Date().getFullYear());
  const [lunarMonth, setLunarMonth] = useState(1);
  const [lunarDay, setLunarDay] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      loadEvent(parseInt(id));
    }
  }, [id, isEditing]);

  const loadEvent = async (eventId: number) => {
    try {
      const res = await eventApi.getEvent(eventId);
      const event = res.data;
      setTitle(event.title);
      setType(event.type);
      setDescription(event.description || '');
      setIsRecurring(event.isRecurring);
      setIsPinned(event.isPinned || false);
      
      if (event.isLunar && event.lunarMonth && event.lunarDay) {
        setDateMode('lunar');
        const eventDate = new Date(event.date);
        setLunarYear(eventDate.getFullYear());
        setLunarMonth(event.lunarMonth);
        setLunarDay(event.lunarDay);
      } else {
        setDateMode('solar');
        const eventDate = new Date(event.date);
        setSolarYear(eventDate.getFullYear());
        setSolarMonth(eventDate.getMonth() + 1);
        setSolarDay(eventDate.getDate());
      }
    } catch (error) {
      console.error('Failed to load event:', error);
      navigate('/');
    }
  };

  const getFinalDate = () => {
    if (dateMode === 'lunar') {
      try {
        const solarDate = lunarToSolar(lunarMonth, lunarDay, false, lunarYear);
        return solarDate.toISOString();
      } catch {
        return new Date(solarYear, solarMonth - 1, solarDay).toISOString();
      }
    }
    return new Date(solarYear, solarMonth - 1, solarDay).toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const finalDate = getFinalDate();
      
      const data = {
        title,
        date: finalDate,
        type,
        description: description || undefined,
        isRecurring,
        isPinned,
        isLunar: dateMode === 'lunar',
        lunarMonth: dateMode === 'lunar' ? lunarMonth : null,
        lunarDay: dateMode === 'lunar' ? lunarDay : null,
      };

      if (isEditing && id) {
        await eventApi.updateEvent(parseInt(id), data);
      } else {
        await eventApi.createEvent(data);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <BackgroundOrbs />

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="text-slate-500 dark:text-slate-400 hover:transition-colors duration-300 mb-6 flex items-center gap-2"
          style={{ color: themeColor }}
        >
          <span className="text-xl">←</span>
          <span>返回</span>
        </button>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 dark:border-slate-700/60 p-8 liquid-card">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">
            {isEditing ? '编辑事件' : '添加新事件'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm text-red-500 dark:text-red-400 text-sm rounded-2xl border border-red-100/50 dark:border-red-800/50 liquid-error">
                {error}
              </div>
            )}

            <Input
              label="事件标题"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：妈妈生日、结婚纪念日"
              required
              maxLength={50}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                事件类型
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {eventTypes.map((et, index) => (
                  <button
                    key={et.value}
                    type="button"
                    onClick={() => setType(et.value)}
                    className={`relative p-5 rounded-[1.5rem] border-2 transition-all duration-500 overflow-hidden ${
                      type === et.value
                        ? 'border-transparent'
                        : 'border-white/50 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500'
                    } ${type === et.value ? '' : 'bg-white/50 dark:bg-slate-700/50'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {type === et.value && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${et.gradient} opacity-100`} />
                    )}
                    <div className={`relative z-10 ${type === et.value ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      <div className="text-3xl mb-2 liquid-icon">{et.icon}</div>
                      <div className={`text-sm font-semibold ${type === et.value ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                        {et.label}
                      </div>
                    </div>
                    {type === et.value && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${et.activeGradient} opacity-20 animate-pulse`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                选择日期类型
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDateMode('solar')}
                  className={`relative p-5 rounded-[1.5rem] border-2 transition-all duration-500 overflow-hidden ${
                    dateMode === 'solar'
                      ? 'border-indigo-400'
                      : 'border-white/50 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500'
                  } ${dateMode === 'solar' ? '' : 'bg-white/50 dark:bg-slate-700/50'}`}
                >
                  {dateMode === 'solar' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 opacity-100" />
                  )}
                  <div className="relative z-10">
                    <div className="text-3xl mb-2 liquid-icon">📅</div>
                    <div className={`font-semibold ${dateMode === 'solar' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      公历日期
                    </div>
                  </div>
                  {dateMode === 'solar' && (
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDateMode('lunar')}
                  className={`relative p-5 rounded-[1.5rem] border-2 transition-all duration-500 overflow-hidden ${
                    dateMode === 'lunar'
                      ? 'border-amber-400'
                      : 'border-white/50 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500'
                  } ${dateMode === 'lunar' ? '' : 'bg-white/50 dark:bg-slate-700/50'}`}
                >
                  {dateMode === 'lunar' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 opacity-100" />
                  )}
                  <div className="relative z-10">
                    <div className="text-3xl mb-2 liquid-icon">🌙</div>
                    <div className={`font-semibold ${dateMode === 'lunar' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      农历日期
                    </div>
                  </div>
                  {dateMode === 'lunar' && (
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                  )}
                </button>
              </div>
            </div>

            <div className={`relative p-6 rounded-[1.5rem] transition-all duration-500 ${
              dateMode === 'solar' 
                ? 'bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-indigo-900/30 dark:to-blue-900/30' 
                : 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/30'
            }`}>
              <div className={`absolute inset-0 rounded-[1.5rem] ${
                dateMode === 'solar'
                  ? 'bg-gradient-to-br from-indigo-400/10 to-blue-400/10'
                  : 'bg-gradient-to-br from-amber-400/10 to-orange-400/10'
              }`} />
              
              {dateMode === 'solar' ? (
                <div className="grid grid-cols-3 gap-4 relative z-10">
                  <LiquidSelect
                    label="年份"
                    value={solarYear}
                    onChange={(val) => {
                      setSolarYear(val);
                      const daysInMonth = new Date(val, solarMonth, 0).getDate();
                      if (solarDay > daysInMonth) {
                        setSolarDay(daysInMonth);
                      }
                    }}
                    options={getSolarYears()}
                    colorClass="indigo"
                  />
                  <LiquidSelect
                    label="月份"
                    value={solarMonth}
                    onChange={(val) => {
                      setSolarMonth(val);
                      const daysInMonth = new Date(solarYear, val, 0).getDate();
                      if (solarDay > daysInMonth) {
                        setSolarDay(daysInMonth);
                      }
                    }}
                    options={getSolarMonths()}
                    colorClass="indigo"
                  />
                  <LiquidSelect
                    label="日期"
                    value={solarDay}
                    onChange={setSolarDay}
                    options={getSolarDays(solarYear, solarMonth)}
                    colorClass="indigo"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 relative z-10">
                  <LiquidSelect
                    label="年份"
                    value={lunarYear}
                    onChange={setLunarYear}
                    options={getLunarYears()}
                    colorClass="amber"
                  />
                  <LiquidSelect
                    label="月份"
                    value={lunarMonth}
                    onChange={setLunarMonth}
                    options={LUNAR_MONTHS}
                    colorClass="amber"
                  />
                  <LiquidSelect
                    label="日期"
                    value={lunarDay}
                    onChange={setLunarDay}
                    options={LUNAR_DAYS}
                    colorClass="amber"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-700/50 rounded-2xl">
              <LiquidCheckbox
                checked={isRecurring}
                onChange={setIsRecurring}
                label="每年重复"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-700/50 rounded-2xl">
              <LiquidCheckbox
                checked={isPinned}
                onChange={setIsPinned}
                label="置顶事件"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 liquid-label">
                描述（可选）
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="添加一些备注..."
                rows={3}
                maxLength={200}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-500 focus:outline-none focus:ring-2 focus:border-transparent liquid-textarea resize-none"
                style={{ '--tw-ring-color': themeColor + '60' } as React.CSSProperties}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/')} liquid>
                取消
              </Button>
              <Button type="submit" className="flex-1" disabled={loading} liquid>
                {loading ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
