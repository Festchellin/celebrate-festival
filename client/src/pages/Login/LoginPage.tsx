import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

const BackgroundOrbs = () => (
  <div className="bg-animation">
    <div className="orb orb-1" />
    <div className="orb orb-2" />
    <div className="orb orb-3" />
    <div className="orb orb-4" />
  </div>
);

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <BackgroundOrbs />

      <div className="relative w-full max-w-md page-enter">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-white/60 p-8 liquid-card">
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30 liquid-icon-container">
              <span className="text-5xl bounce-subtle">🎉</span>
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white liquid-title">欢迎回来</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">登录您的账户</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm text-red-500 dark:text-red-400 text-sm rounded-2xl border border-red-100/50 dark:border-red-800/50 liquid-error">
                {error}
              </div>
            )}

            <Input
              label="用户名"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />

            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />

            <Button type="submit" className="w-full" disabled={loading} liquid>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 mt-8">
            还没有账户？{' '}
            <Link to="/register" className="font-medium hover:underline liquid-link" style={{ color: 'var(--color-primary, #6366F1)' }}>
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
