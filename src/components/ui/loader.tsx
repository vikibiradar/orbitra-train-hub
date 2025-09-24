import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9', 
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div 
        className={cn(
          "border-4 rounded-full border-l-ps-primary animate-spin",
          "border-ps-primary/10",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export const LoaderSpinner: React.FC<LoaderProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn("flex justify-center items-center h-full", className)}>
      <div 
        className={cn(
          "border-4 rounded-full animate-spin ps-transition",
          "border-ps-primary/10 border-l-ps-primary",
          sizeClasses[size]
        )}
        style={{
          animation: 'spin 1s ease infinite'
        }}
      />
    </div>
  );
};

// CSS-in-JS for the spinner animation (included in the component for better isolation)
const spinnerStyles = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('ps-loader-styles')) {
  const style = document.createElement('style');
  style.id = 'ps-loader-styles';
  style.textContent = spinnerStyles;
  document.head.appendChild(style);
}