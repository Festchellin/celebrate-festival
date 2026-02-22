import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/layout/Header';
import { CountdownCard } from '../../components/countdown/CountdownCard';
import { Button } from '../../components/common/Button';
import { eventApi, shareApi } from '../../api';
import { Event, EventType } from '../../types';

const eventTypes: { value: EventType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '全部' },
  { value: 'BIRTHDAY', label: '🎂 生日' },
  { value: 'ANNIVERSARY', label: '❤️ 纪念日' },
  { value: 'FESTIVAL', label: '🏮 传统节日' },
  { value: 'CUSTOM', label: '📌 自定义' },
];

const BackgroundOrbs = () => (
  <div className="bg-animation">
    <div className="orb orb-1" />
    <div className="orb orb-2" />
    <div className="orb orb-3" />
    <div className="orb orb-4" />
  </div>
);

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EventType | 'ALL'>('ALL');
  const [shareModal, setShareModal] = useState<{ eventId: number; url: string } | null>(null);

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      const res = await eventApi.getEvents(filter === 'ALL' ? undefined : filter);
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个事件吗？')) return;
    try {
      await eventApi.deleteEvent(id);
      loadEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleShare = async (eventId: number) => {
    try {
      const res = await shareApi.createShareLink(eventId);
      setShareModal({ eventId, url: res.data.shareUrl });
    } catch (error) {
      console.error('Failed to create share link:', error);
    }
  };

  const handlePin = async (eventId: number, currentPinned: boolean) => {
    try {
      await eventApi.updateEvent(eventId, { isPinned: !currentPinned });
      loadEvents();
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const copyShareUrl = async () => {
    if (shareModal) {
      const fullUrl = window.location.origin + shareModal.url;
      try {
        await navigator.clipboard.writeText(fullUrl);
        alert('链接已复制到剪贴板！');
      } catch (err) {
        const input = document.querySelector('input[readonly]') as HTMLInputElement;
        if (input) {
          input.select();
          document.execCommand('copy');
          alert('链接已复制到剪贴板！');
        }
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <BackgroundOrbs />
        <div className="text-center relative z-10 page-enter">
          <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
            <span className="text-5xl bounce-subtle">🎉</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">记录美好时刻</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">为您的节日、生日、纪念日设置倒计时</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button className="btn-shine ripple">登录</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="ripple">注册</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8 page-enter">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              你好，{user.nickname || user.username} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">距离下一个重要日子还有...</p>
          </div>
          
          <Link to="/add">
            <Button className="btn-shine ripple flex items-center gap-2 shadow-lg">
              <span className="text-lg">+</span> 添加事件
            </Button>
          </Link>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 page-enter" style={{ animationDelay: '0.1s' }}>
          {eventTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                filter === type.value
                  ? 'text-white shadow-lg'
                  : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 page-enter" style={{ animationDelay: '0.2s' }}>
            <div className="w-24 h-24 bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-5xl icon-float">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">还没有任何事件</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">点击上方按钮添加您的第一个倒计时</p>
            <Link to="/add">
              <Button className="btn-shine">添加事件</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
            {events.map((event) => (
              <CountdownCard
                key={event.id}
                event={event}
                onEdit={() => navigate(`/edit/${event.id}`)}
                onDelete={() => handleDelete(event.id)}
                onShare={() => handleShare(event.id)}
                onPin={() => handlePin(event.id, event.isPinned)}
              />
            ))}
          </div>
        )}
      </main>

      {shareModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 page-enter">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/50 dark:border-slate-700/50">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">分享链接</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">复制以下链接分享给他人：</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={window.location.origin + shareModal.url}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              />
              <Button onClick={copyShareUrl} className="btn-shine">复制</Button>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShareModal(null)}
            >
              关闭
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
