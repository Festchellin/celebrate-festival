import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
  liquid?: boolean;
  style?: CSSProperties;
}

export const Card = ({ children, className = '', onClick, glow = false, liquid = true, style }: CardProps) => {
  return (
    <div
      className={`relative overflow-hidden ${
        liquid 
          ? 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-indigo-500/10 dark:shadow-slate-900/50 border border-white/60 dark:border-slate-700/60 p-6 liquid-card' 
          : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/50 dark:border-slate-700/50 p-6 card-glow'
      } ${
        onClick ? 'cursor-pointer' : ''
      } ${glow ? 'today-pulse' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {liquid && (
        <>
          <div className="liquid-orb liquid-orb-1 dark:!bg-gradient-to-br dark:!from-indigo-500/30 dark:!to-purple-500/30" />
          <div className="liquid-orb liquid-orb-2 dark:!bg-gradient-to-br dark:!from-pink-500/30 dark:!to-orange-500/30" />
          <div className="liquid-shine-card dark:!bg-gradient-to-r dark:!from-transparent dark:!via-slate-400/10 dark:!to-transparent" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
