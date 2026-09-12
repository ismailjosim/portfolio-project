'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
}

const TablePagination = ({ currentPage, totalPages }: TablePaginationProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const navigateToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const changeLimit = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit);
    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const currentLimit = searchParams.get('limit') || '10';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1 w-full">
      {/* Items per page selector */}
      <div className="flex items-center gap-2 order-2 sm:order-1 text-sm text-muted-foreground">
        <span>Rows per page:</span>
        <Select value={currentLimit} onValueChange={changeLimit} disabled={isPending}>
          <SelectTrigger className="w-16 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="hidden sm:inline-block text-xs">
          (Page {currentPage} of {totalPages || 1})
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="h-8 px-2.5 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
          <span className="hidden xs:inline">Prev</span>
        </Button>

        <div className="hidden xs:flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            let pageNumber;

            if (totalPages <= 5) {
              pageNumber = index + 1;
            } else if (currentPage <= 3) {
              pageNumber = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = currentPage - 2 + index;
            }
            return (
              <Button
                key={pageNumber}
                variant={pageNumber === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigateToPage(pageNumber)}
                disabled={isPending}
                className="size-8 p-0 text-xs"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <span className="xs:hidden text-xs text-muted-foreground px-2">
          {currentPage} / {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="h-8 px-2.5 text-xs"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
