import { useSearchParams, useRouter } from 'next/navigation';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Trash,
} from 'lucide-react';
import { useTransition } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  sortKey?: string;
}

interface ManagementTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  /**
   * Extra items rendered at the bottom of the row's action menu — for row actions that
   * are neither view/edit/delete (e.g. "Mark as spam"). Return `<DropdownMenuItem>`s.
   */
  extraActions?: (row: T) => React.ReactNode;
  /**
   * Extra classes for a whole row, so a row's state can be shown across every column
   * (e.g. dimming and striking through a comment that has been marked as spam).
   */
  rowClassName?: (row: T) => string | undefined;
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  isRefreshing?: boolean;
}

function ManagementTable<T>({
  data = [],
  columns = [],
  onView,
  onEdit,
  onDelete,
  extraActions,
  rowClassName,
  getRowKey,
  emptyMessage = 'No records found.',
  isRefreshing = false,
}: ManagementTableProps<T>) {
  const hasActions = onView || onEdit || onDelete || extraActions;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSortBy = searchParams.get('sortBy') || '';
  const currentOrderBy = searchParams.get('orderBy') || 'desc';
  const ascendingFirstSortKeys = new Set([
    'category',
    'name',
    'proficiency',
    'status',
    'title',
    'type',
  ]);

  const handleSort = (sortKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Toggle sort order if clicking the same column
    if (currentSortBy === sortKey) {
      const newOrder = currentOrderBy === 'asc' ? 'desc' : 'asc';
      params.set('orderBy', newOrder);
    } else {
      const defaultOrder = ascendingFirstSortKeys.has(sortKey) ? 'asc' : 'desc';
      params.set('sortBy', sortKey);
      params.set('orderBy', defaultOrder);
    }

    params.set('page', '1'); // Reset to first page

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const getSortIcon = (sortKey?: string) => {
    if (!sortKey) return null;

    if (currentSortBy !== sortKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }

    return currentOrderBy === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <>
      <div className="rounded-lg border relative overflow-hidden">
        {/* Refreshing Overlay */}
        {isRefreshing && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Refreshing...</p>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              {columns?.map((column, colIndex) => (
                <TableHead key={colIndex} className={column.className}>
                  {column.sortKey ? (
                    <span
                      onClick={() => handleSort(column.sortKey!)}
                      className="flex items-center p-2 hover:text-foreground transition-colors font-medium cursor-pointer select-none"
                    >
                      {column.header}
                      {getSortIcon(column.sortKey)}
                    </span>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {hasActions && <TableHead className="w-17.5">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data?.map((item) => (
                <TableRow key={getRowKey(item)} className={rowClassName?.(item)}>
                  {columns.map((col, idx) => (
                    <TableCell key={idx} className={col.className}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : String(item[col.accessor])}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              className="text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                          {extraActions?.(item)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ManagementTable;
