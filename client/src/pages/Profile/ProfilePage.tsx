import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ThemeSelector } from '../../components/common/ThemeSelector';

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateUser({
        nickname: nickname || undefined,
        avatar: avatar || undefined,
        bio: bio || undefined,
      });
      setMessage('保存成功！');
    } catch {
      setMessage('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 flex items-center gap-2"
        >
          ← 返回
        </button>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/50 dark:border-slate-700/50 p-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">个人资料</h1>

          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 dark:from-indigo-900/50 to-purple-100 dark:to-purple-900/50 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold" style={{ color: 'var(--color-primary, #6366F1)' }}>
                    {user?.username?.[0] || ''}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{user?.username}</h2>
              <p className="text-slate-500 dark:text-slate-400">注册用户</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {message && (
              <div className={`p-3 text-sm rounded-xl ${message.includes('成功') ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'}`}>
                {message}
              </div>
            )}

            <Input
              label="头像URL"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />

            <Input
              label="昵称"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入昵称"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                个性签名
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="介绍一下自己..."
                rows={3}
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                style={{ '--tw-ring-color': 'var(--color-primary, #6366F1)' } as React.CSSProperties}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '保存中...' : '保存修改'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">主题设置</h3>
            <ThemeSelector />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <Button variant="danger" className="w-full" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
