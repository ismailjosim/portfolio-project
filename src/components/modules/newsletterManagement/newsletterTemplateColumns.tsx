import { Column } from '../../shared/ManagementTable';
import { NewsletterTemplateItem } from '@/src/types/newsletter.interface';
import { FileText, Users, Calendar } from 'lucide-react';
import { Badge } from '../../ui/badge';

export const newsletterTemplateColumns: Column<NewsletterTemplateItem>[] = [
  {
    header: 'Template / Subject',
    sortKey: 'subject',
    className: 'min-w-[240px]',
    accessor: (row) => (
      <div className="flex items-start gap-3 py-1">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
          <FileText className="size-4.5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-foreground text-sm truncate max-w-65 sm:max-w-md">
            {row.subject}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-65 sm:max-w-md">
            {row.content.replace(/[#*`_>\[\]]/g, '').trim()}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: 'Recipients',
    sortKey: 'recipientCount',
    className: 'whitespace-nowrap',
    accessor: (row) => (
      <Badge
        variant="secondary"
        className="font-normal inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs bg-muted/60 text-muted-foreground border border-border/40"
      >
        <Users className="size-3 text-primary/70" />
        <span className="font-medium text-foreground">{row.recipientCount}</span>{' '}
        {row.recipientCount === 1 ? 'recipient' : 'recipients'}
      </Badge>
    ),
  },
  {
    header: 'Sent Date',
    sortKey: 'sentAt',
    className: 'whitespace-nowrap',
    accessor: (row) => {
      const date = new Date(row.sentAt || row.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3.5 text-muted-foreground/70 shrink-0" />
          <span>
            {formattedDate} <span className="text-muted-foreground/60">at {formattedTime}</span>
          </span>
        </div>
      );
    },
  },
];
