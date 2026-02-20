import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
  liquid?: boolean;
}

export const Card = ({ children, className = '', onClick, glow = false, liquid = true }: CardProps) => {
  return (
    <div
      className={`relative overflow-hidden ${
        liquid 
          ? 'bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-indigo-500/10 border border-white/60 p-6 liquid-card' 
          : 'bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 card-glow'
      } ${
        onClick ? 'cursor-pointer' : ''
      } ${glow ? 'today-pulse' : ''} ${className}`}
      onClick={onClick}
    >
      {liquid && (
        <>
          <div className="liquid-orb liquid-orb-1" />
          <div className="liquid-orb liquid-orb-2" />
          <div className="liquid-shine-card" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
