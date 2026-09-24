import { Trash2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { BlockedEmail } from '@/src/types/newsletter.interface';

interface BlockedEmailsTableProps {
  blockedEmails: BlockedEmail[];
  onUnblock: (email: string) => void;
}

export function BlockedEmailsTable({ blockedEmails, onUnblock }: BlockedEmailsTableProps) {
  if (blockedEmails.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          Blocked Emails{' '}
          <span className="text-xs text-muted-foreground">({blockedEmails.length})</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">Email</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">Reason</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">Blocked</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {blockedEmails.map((b) => (
              <tr
                key={b._id}
                className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <td className="px-5 py-3 font-mono text-xs text-foreground">{b.email}</td>
                <td className="px-5 py-3 text-muted-foreground text-sm">{b.reason || '—'}</td>
                <td className="px-5 py-3 text-muted-foreground text-sm">
                  {new Date(b.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-5 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    onClick={() => onUnblock(b.email)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Unblock this email</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
