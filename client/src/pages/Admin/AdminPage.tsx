import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/common/Button';
import { adminApi } from '../../api';

interface User {
  id: number;
  username: string;
  nickname: string | null;
  role: string;
  createdAt: string;
  _count: { events: number };
}

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  user: {
    id: number;
    username: string;
    nickname: string | null;
  };
  createdAt: string;
}

const BackgroundOrbs = () => (
  <div className="bg-animation">
    <div className="orb orb-1" />
    <div className="orb orb-2" />
    <div className="orb orb-3" />
    <div className="orb orb-4" />
  </div>
);

export const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await adminApi.getUsers();
        setUsers(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await adminApi.getEvents();
        setEvents(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      if (activeTab === 'users') {
        setUsers([]);
      } else {
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    try {
      await adminApi.deleteUser(userId);
      loadData();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUpdateRole = async (userId: number, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      loadData();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('确定要删除这个事件吗？')) return;
    try {
      await adminApi.deleteEvent(eventId);
      loadData();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8 page-enter">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">管理员面板</h1>
            <p className="text-slate-500 mt-1">管理用户和事件</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6 page-enter">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/80 backdrop-blur text-slate-600 hover:bg-white'
            }`}
          >
            👥 用户管理
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/80 backdrop-blur text-slate-600 hover:bg-white'
            }`}
          >
            📅 事件管理
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden page-enter">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">用户名</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">昵称</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">角色</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">事件数</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">注册时间</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-600">{u.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{u.username}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.nickname || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${
                          u.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <option value="USER">用户</option>
                        <option value="ADMIN">管理员</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u._count.events}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-slate-500">暂无用户</div>
            )}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden page-enter">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">标题</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">类型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">日期</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">创建者</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">创建时间</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-600">{e.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{e.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{e.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(e.date)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {e.user.nickname || e.user.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(e.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.length === 0 && (
              <div className="text-center py-12 text-slate-500">暂无事件</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
