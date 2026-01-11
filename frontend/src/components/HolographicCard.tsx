import React from 'react';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  glow?: boolean;
}

const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  variant = 'default',
  glow = false,
}) => {
  const variantStyles = {
    default: 'border-primary/30 from-primary/10 to-secondary/5',
    success: 'border-success/30 from-success/15 to-success/5',
    warning: 'border-warning/30 from-warning/15 to-warning/5',
    error: 'border-destructive/30 from-destructive/15 to-destructive/5',
  };

  const glowStyles = {
    default: 'glow-primary',
    success: 'shadow-[0_0_30px_hsl(142_71%_45%/0.3)]',
    warning: 'glow-accent',
    error: 'shadow-[0_0_30px_hsl(0_72%_51%/0.3)]',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl backdrop-blur-xl',
        'border bg-gradient-to-br',
        'transition-all duration-500',
        variantStyles[variant],
        glow && glowStyles[variant],
        className
      )}
    >
      {/* Holographic shimmer effect */}
      <div className="absolute inset-0 holographic opacity-30" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HolographicCard;
