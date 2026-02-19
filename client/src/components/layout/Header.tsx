import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl">🎉</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Celebrate
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm text-slate-500 hover:text-indigo-500 transition-colors">
                管理
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-indigo-600 font-semibold">
                    {user.nickname?.[0] || user.username?.[0] || ''}
                  </span>
                )}
              </div>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              退出
            </Button>
          </div>
        )}
      </div>
      {children}
    </header>
  );
};
