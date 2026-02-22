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

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6个字符');
      return;
    }

    setLoading(true);

    try {
      await register(username, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.error || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <BackgroundOrbs />

      <div className="relative w-full max-w-md page-enter">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/50 dark:border-slate-700/50 p-8 card-glow">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
              <span className="text-4xl bounce-subtle">🎉</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">创建账户</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">开始记录您的美好时刻</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800/50">
                {error}
              </div>
            )}

            <Input
              label="用户名"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名（3-20字符）"
              required
              minLength={3}
              maxLength={20}
            />

            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6字符）"
              required
              minLength={6}
            />

            <Input
              label="确认密码"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              required
            />

            <Button type="submit" className="w-full btn-shine ripple" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </Button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 mt-6">
            已有账户？{' '}
            <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--color-primary, #6366F1)' }}>
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
