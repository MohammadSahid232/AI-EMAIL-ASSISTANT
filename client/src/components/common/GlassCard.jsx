import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const GlassCard = ({ children, className, hover = true, glow = false }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-card rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
          hover && 'hover:-translate-y-1 hover:shadow-xl hover:border-brand-500/30',
          glow && 'glow-primary',
          className
        )
      )}
    >
      {children}
    </div>
  );
};
