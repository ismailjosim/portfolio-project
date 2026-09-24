'use client';

import { Users, UserCheck, UserMinus, Mail, Calendar } from 'lucide-react';

interface Subscriber {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: Date | string;
  createdAt: Date | string;
}

interface Stats {
  totalActive: number;
  totalInactive: number;
  total: number;
}

interface NewsletterDashboardProps {
  stats: Stats;
  recentSubscribers: Subscriber[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
      <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tabular-nums">{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function NewsletterDashboard({ stats, recentSubscribers }: NewsletterDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Newsletter Subscribers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your newsletter audience and monitor subscriptions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total Subscribers"
          value={stats.total}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          icon={UserCheck}
          label="Active"
          value={stats.totalActive}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          icon={UserMinus}
          label="Unsubscribed"
          value={stats.totalInactive}
          color="bg-rose-500/10 text-rose-500"
        />
      </div>

      {/* Subscriber list */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Active Subscribers</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            Last 20
          </span>
        </div>

        {recentSubscribers.length === 0 ? (
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
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {recentSubscribers.map((s) => (
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
                          Unsubscribed
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
