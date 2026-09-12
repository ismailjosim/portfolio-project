import { cn } from '@/src/lib/utils';
import React from 'react';
import { Spinner } from './spinner';

interface LoadingProps {
  message?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message, className = '' }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-6 space-y-3', className)}>
      <Spinner className="h-8 w-8 text-primary" />
      {message && (
        <span className="text-xs font-medium tracking-wide text-muted-foreground/80 animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
};
