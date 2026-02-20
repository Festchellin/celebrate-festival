import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full relative">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2 liquid-label">
            {label}
          </label>
        )}
        <div className="relative liquid-input-wrapper">
          <input
            ref={ref}
            className={`w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent liquid-input ${
              error ? 'liquid-input-error' : ''
            } ${className}`}
            {...props}
          />
          <div className="liquid-input-ripple" />
        </div>
        {error && <p className="mt-2 text-sm text-red-500 liquid-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
