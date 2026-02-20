import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  liquid?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  liquid = true,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = liquid
    ? 'relative overflow-hidden inline-flex items-center justify-center font-medium rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 liquid-button'
    : 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';
  
  const variants = {
    primary: liquid
      ? 'bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 text-white focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 liquid-glow'
      : 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5',
    secondary: liquid
      ? 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white focus:ring-indigo-500 border border-white/50 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 liquid-glow-secondary'
      : 'bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500 border border-slate-200 hover:border-slate-300 hover:shadow-md',
    danger: liquid
      ? 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white focus:ring-red-500 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-1 liquid-glow-danger'
      : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30',
    ghost: liquid
      ? 'text-slate-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50 liquid-text-hover'
      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
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
