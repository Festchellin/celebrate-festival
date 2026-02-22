import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { themeColor } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${themeColor}, ${adjustColor(themeColor, 40)})` }}
          >
            <span className="text-white text-xl">🎉</span>
          </div>
          <span 
            className="text-xl font-bold text-slate-800 dark:text-white"
          >
            Celebrate
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className="text-sm text-slate-500 dark:text-slate-400 hover:transition-colors"
                style={{ color: themeColor }}
              >
                管理
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${themeColor}20, ${adjustColor(themeColor, 40)}20)` }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span 
                    className="font-semibold"
                    style={{ color: themeColor }}
                  >
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

const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
