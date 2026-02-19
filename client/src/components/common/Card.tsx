import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}

export const Card = ({ children, className = '', onClick, glow = false }: CardProps) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 card-glow ${
        onClick ? 'cursor-pointer' : ''
      } ${glow ? 'today-pulse' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
