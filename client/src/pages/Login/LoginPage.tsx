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
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 p-8 card-glow">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
              <span className="text-4xl bounce-subtle">🎉</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">欢迎回来</h1>
            <p className="text-slate-500 mt-2">登录您的账户</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
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

            <Button type="submit" className="w-full btn-shine ripple" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>

          <p className="text-center text-slate-500 mt-6">
            还没有账户？{' '}
            <Link to="/register" className="text-indigo-500 hover:text-indigo-600 font-medium hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
