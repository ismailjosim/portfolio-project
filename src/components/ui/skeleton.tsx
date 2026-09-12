import { cn } from '@/src/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted/65 dark:bg-muted/35', className)}
      {...props}
    />
  );
}

export { Skeleton };
