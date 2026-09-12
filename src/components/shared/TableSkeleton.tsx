import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showActions?: boolean;
}

export function TableSkeleton({ columns = 6, rows = 10, showActions = true }: TableSkeletonProps) {
  const headerWidths = ['w-24', 'w-36', 'w-28', 'w-20', 'w-24', 'w-16'];
  const cellWidths = ['w-3/4', 'w-5/6', 'w-2/3', 'w-1/2', 'w-4/5', 'w-3/5'];

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-card/40">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-border/60 hover:bg-transparent">
            {[...Array(columns)].map((_, i) => (
              <TableHead key={i} className="py-3.5">
                <Skeleton className={`h-4 ${headerWidths[i % headerWidths.length]}`} />
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="w-16 text-right py-3.5">
                <Skeleton className="h-4 w-10 ml-auto" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-border/40">
              {[...Array(columns)].map((_, colIndex) => (
                <TableCell key={colIndex} className="py-4">
                  <div className="flex items-center gap-3">
                    {colIndex === 0 && <Skeleton className="h-8 w-8 shrink-0 rounded-full" />}
                    <Skeleton
                      className={`h-3.5 ${colIndex === 0 ? 'w-32' : cellWidths[(rowIndex + colIndex) % cellWidths.length]}`}
                    />
                  </div>
                </TableCell>
              ))}
              {showActions && (
                <TableCell className="py-4 text-right">
                  <Skeleton className="h-8 w-8 ml-auto rounded-lg" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
