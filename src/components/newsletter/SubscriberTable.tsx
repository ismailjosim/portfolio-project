import { Mail, Calendar, Shield } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Subscriber } from '@/src/types/newsletter.interface';

interface SubscriberTableProps {
  subscribers: Subscriber[];
  onInitiateBlock: (email: string) => void;
}

export function SubscriberTable({ subscribers, onInitiateBlock }: SubscriberTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Recent Active Subscribers</h2>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          Last 20
        </span>
      </div>

      {subscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
          <Mail className="h-10 w-10 opacity-30" />
          <p className="font-medium">No subscribers yet</p>
          <p className="text-sm">Share your newsletter section to start growing your audience.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Email</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                  Subscribed
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr
                  key={s._id}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{s.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{s.name || '—'}</td>
                  <td className="px-5 py-3">
                    {s.isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-full px-2 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3 w-3" />
                      {new Date(s.subscribedAt ?? s.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                      onClick={() => onInitiateBlock(s.email)}
                    >
                      <Shield className="h-4 w-4" />
                      <span className="sr-only">Block this email</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
