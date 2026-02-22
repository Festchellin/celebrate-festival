import { InputHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const { themeColor } = useTheme();
    return (
      <div className="w-full relative">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 liquid-label">
            {label}
          </label>
        )}
        <div className="relative liquid-input-wrapper">
          <input
            ref={ref}
            className={`w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-500 focus:outline-none focus:ring-2 focus:border-transparent liquid-input ${
              error ? 'liquid-input-error' : ''
            } ${className}`}
            style={{ '--tw-ring-color': themeColor + '60' } as React.CSSProperties}
            {...props}
          />
          <div className="liquid-input-ripple" />
        </div>
        {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400 liquid-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
