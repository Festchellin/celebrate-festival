import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { eventApi } from '../../api';
import { EventType } from '../../types';
import { LUNAR_MONTHS, LUNAR_DAYS, lunarToSolar } from '../../utils/lunar';

const eventTypes: { value: EventType; label: string; icon: string; color: string }[] = [
  { value: 'BIRTHDAY', label: '生日', icon: '🎂', color: 'bg-pink-50 text-pink-500' },
  { value: 'ANNIVERSARY', label: '纪念日', icon: '❤️', color: 'bg-red-50 text-red-500' },
  { value: 'FESTIVAL', label: '传统节日', icon: '🏮', color: 'bg-amber-50 text-amber-500' },
  { value: 'CUSTOM', label: '自定义', icon: '📌', color: 'bg-purple-50 text-purple-500' },
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

export const AddEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('CUSTOM');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-2"
        >
          ← 返回
        </button>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            {isEditing ? '编辑事件' : '添加新事件'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl">
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                事件类型
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {eventTypes.map((et) => (
                  <button
                    key={et.value}
                    type="button"
                    onClick={() => setType(et.value)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      type === et.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{et.icon}</div>
                    <div className={`text-sm font-medium ${type === et.value ? 'text-indigo-600' : 'text-slate-600'}`}>
                      {et.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                选择日期类型
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDateMode('solar')}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    dateMode === 'solar'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">📅</div>
                  <div className={`font-medium ${dateMode === 'solar' ? 'text-indigo-600' : 'text-slate-600'}`}>
                    公历日期
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setDateMode('lunar')}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    dateMode === 'lunar'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">🌙</div>
                  <div className={`font-medium ${dateMode === 'lunar' ? 'text-amber-600' : 'text-slate-600'}`}>
                    农历日期
                  </div>
                </button>
              </div>
            </div>

            {dateMode === 'solar' ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    年份
                  </label>
                  <select
                    value={solarYear}
                    onChange={(e) => {
                      const year = parseInt(e.target.value);
                      setSolarYear(year);
                      const daysInMonth = new Date(year, solarMonth, 0).getDate();
                      if (solarDay > daysInMonth) {
                        setSolarDay(daysInMonth);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {getSolarYears().map((y) => (
                      <option key={y.value} value={y.value}>{y.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    月份
                  </label>
                  <select
                    value={solarMonth}
                    onChange={(e) => {
                      const month = parseInt(e.target.value);
                      setSolarMonth(month);
                      const daysInMonth = new Date(solarYear, month, 0).getDate();
                      if (solarDay > daysInMonth) {
                        setSolarDay(daysInMonth);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {getSolarMonths().map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    日期
                  </label>
                  <select
                    value={solarDay}
                    onChange={(e) => setSolarDay(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {getSolarDays(solarYear, solarMonth).map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    年份
                  </label>
                  <select
                    value={lunarYear}
                    onChange={(e) => setLunarYear(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {getLunarYears().map((y) => (
                      <option key={y.value} value={y.value}>{y.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    月份
                  </label>
                  <select
                    value={lunarMonth}
                    onChange={(e) => setLunarMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {LUNAR_MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    日期
                  </label>
                  <select
                    value={lunarDay}
                    onChange={(e) => setLunarDay(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {LUNAR_DAYS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 text-indigo-500 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isRecurring" className="text-sm text-slate-600">
                每年重复
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                描述（可选）
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="添加一些备注..."
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/')}>
                取消
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
