'use client';

import { Shield } from 'lucide-react';
import type { Column } from '../../shared/ManagementTable';
import type { Subscriber } from '@/src/types/newsletter.interface';
import { DateCell } from '../../shared/DateCell';

export const newsletterColumns: Column<Subscriber>[] = [
  {
    header: 'Subscriber',
    accessor: (sub) => (
      <div className="flex items-center gap-3 min-w-50 max-w-[320px]">
        <div className="size-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs border border-primary/20">
          {(sub.name?.trim() ? sub.name[0] : sub.email[0])?.toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className="font-mono text-sm font-medium text-foreground truncate"
            title={sub.email}
          >
            {sub.email}
          </span>
          <span
            className="text-xs text-muted-foreground truncate"
            title={sub.name || 'No name provided'}
          >
            {sub.name || 'No name provided'}
          </span>
        </div>
      </div>
    ),
    sortKey: 'email',
  },
  {
    header: 'Name',
    accessor: (sub) => (
      <span className="text-sm text-foreground/85">
        {sub.name || <span className="text-muted-foreground/60">—</span>}
      </span>
    ),
    sortKey: 'name',
  },
  {
    header: 'Status',
    accessor: (sub) => {
      if (sub.status === 'blocked' || sub.isBlocked) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border bg-amber-500/15 text-amber-500 border-amber-500/30">
            <Shield className="size-3" />
            Blocked
          </span>
        );
      }

      if (sub.status === 'pending') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border bg-sky-500/15 text-sky-500 border-sky-500/30">
            <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
            Pending Verification
          </span>
        );
      }

      if (sub.isActive) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border bg-emerald-500/15 text-emerald-500 border-emerald-500/30">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border bg-rose-500/15 text-rose-500 border-rose-500/30">
          <span className="size-1.5 rounded-full bg-rose-500" />
          Unsubscribed
        </span>
      );
    },
    sortKey: 'status',
  },
  {
    header: 'Subscribed',
    accessor: (sub) => <DateCell date={sub.subscribedAt || sub.createdAt} />,
    sortKey: 'subscribedAt',
  },
];

export default newsletterColumns;
