import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  liquid?: boolean;
}

const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  liquid = true,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const { themeColor } = useTheme();
  
  const baseStyles = liquid
    ? 'relative overflow-hidden inline-flex items-center justify-center font-medium rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 liquid-button'
    : 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';
  
  const variants = {
    primary: liquid
      ? `text-white focus:ring-[${themeColor}] shadow-lg shadow-[${themeColor}]/30 hover:shadow-xl hover:shadow-[${themeColor}]/40 hover:-translate-y-1`
      : `text-white focus:ring-[${themeColor}] shadow-lg shadow-[${themeColor}]/25 hover:shadow-xl hover:shadow-[${themeColor}]/30 hover:-translate-y-0.5`,
    secondary: liquid
      ? 'bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 focus:ring-indigo-500 border border-white/50 dark:border-slate-600/50 hover:border-indigo-200 dark:hover:border-slate-500 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 liquid-glow-secondary'
      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:ring-indigo-500 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md',
    danger: liquid
      ? 'text-white focus:ring-red-500 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-1 liquid-glow-danger'
      : 'text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30',
    ghost: liquid
      ? `text-slate-600 dark:text-slate-300 hover:text-[${themeColor}] hover:bg-gradient-to-r hover:from-[${themeColor}]/10 hover:to-[${adjustColor(themeColor, 40)}]/10 liquid-text-hover`
      : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700',
  };

  const getPrimaryStyle = () => {
    if (variant !== 'primary') return {};
    const lighter = adjustColor(themeColor, 40);
    if (liquid) {
      return {
        background: `linear-gradient(135deg, ${themeColor}, ${lighter})`,
        boxShadow: `0 10px 40px -10px ${themeColor}40`,
      };
    }
    return {
      background: themeColor,
      boxShadow: `0 10px 40px -10px ${themeColor}40`,
    };
  };

  const getDangerStyle = () => {
    if (variant !== 'danger') return {};
    const darker = adjustColor(themeColor, -40);
    return {
      background: `linear-gradient(135deg, ${darker}, ${themeColor})`,
      boxShadow: `0 10px 40px -10px ${themeColor}40`,
    };
  };

  const getGhostStyle = () => {
    if (variant !== 'ghost') return {};
    const lightColor = `${themeColor}15`;
    return {
      color: themeColor,
      background: liquid ? `linear-gradient(90deg, ${lightColor}, ${adjustColor(themeColor, 40)}15)` : undefined,
    };
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{
        ...getPrimaryStyle(),
        ...getDangerStyle(),
        ...getGhostStyle(),
        ['--tw-ring-color' as string]: themeColor,
      }}
      {...props}
    >
      {liquid && (
        <>
          <span className="liquid-shine" />
          <span className="liquid-blob" />
        </>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
