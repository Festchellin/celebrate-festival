import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';
  
  const variants = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500 border border-slate-200 hover:border-slate-300 hover:shadow-md',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30',
    ghost: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
