'use client';

interface DateCellProps {
  date?: string | Date;
}

export function DateCell({ date }: DateCellProps) {
  if (!date) return <span className="text-xs text-muted-foreground">—</span>;

  const d = new Date(date);
  if (isNaN(d.getTime())) return <span className="text-xs text-muted-foreground">—</span>;

  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col text-xs leading-tight">
      <span className="font-medium text-foreground">{dateStr}</span>
      <span className="text-muted-foreground/75 text-[11px]">{timeStr}</span>
    </div>
  );
}
