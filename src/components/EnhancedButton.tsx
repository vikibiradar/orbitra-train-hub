import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  effect?: 'glow' | 'lift' | 'scale' | 'none';
  shimmer?: boolean;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  className,
  variant = 'primary',
  effect = 'lift',
  shimmer = false,
  ...props
}) => {
  const variantClasses = {
    primary: 'ps-gradient-bg text-white border-0 hover:shadow-hover',
    secondary: 'bg-gradient-secondary text-white border-0 hover:shadow-md',
    success: 'bg-ps-success hover:bg-ps-success-light text-white border-0',
    warning: 'bg-ps-warning hover:bg-ps-warning-light text-white border-0',
    error: 'bg-ps-error hover:bg-ps-error-light text-white border-0',
    ghost: 'bg-transparent hover:bg-ps-primary/10 text-ps-primary border border-ps-primary/20',
    outline: 'bg-transparent hover:bg-ps-primary hover:text-white border border-ps-primary text-ps-primary',
  };

  const effectClasses = {
    glow: 'hover:ps-glow',
    lift: 'hover:ps-hover-lift',
    scale: 'hover:ps-hover-scale',
    none: '',
  };

  return (
    <motion.div
      whileHover={{ scale: effect === 'scale' ? 1.05 : 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant={variant === 'primary' || variant === 'success' || variant === 'warning' || variant === 'error' ? 'default' : variant as any}
        className={cn(
          'ps-transition relative overflow-hidden',
          variantClasses[variant],
          effectClasses[effect],
          shimmer && 'ps-gradient-bg',
          className
        )}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
};