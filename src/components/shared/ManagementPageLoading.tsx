'use client';

import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';
import { TableSkeleton } from './TableSkeleton';

interface ManagementPageLoadingProps {
  columns: number;
  hasActionButton?: boolean;
  filterCount?: number;
  filterWidths?: string[];
}

export function ManagementPageLoading({
  columns,
  hasActionButton = false,
  filterCount = 0,
  filterWidths = [],
}: ManagementPageLoadingProps) {
  // Memoize filter elements to prevent recreation on every render
  const filterElements = useMemo(() => {
    if (filterCount === 0) return null;

    return (
      <div className="flex items-center gap-3">
        {Array.from({ length: filterCount }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-10 ${filterWidths[index] || 'w-40'} rounded-lg border border-border/40`}
          />
        ))}
      </div>
    );
  }, [filterCount, filterWidths]);

  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>
        {hasActionButton && <Skeleton className="h-10 w-32 rounded-lg" />}
      </div>

      {/* Filters Skeleton */}
      {filterElements}

      {/* Table Skeleton */}
      <TableSkeleton columns={columns} rows={10} />
    </div>
  );
}
