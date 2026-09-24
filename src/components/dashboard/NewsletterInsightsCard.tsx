'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Mail,
  Send,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Radio,
} from 'lucide-react';
import Link from 'next/link';

export interface NewsletterMetrics {
  totalEmailsSent: number;
  totalSubscribers: number;
  activeSubscribers: number;
  broadcastsSent: number;
  verificationsSent: number;
  welcomeSent: number;
  contactMessagesSent: number;
}

interface NewsletterInsightsCardProps {
  metrics: NewsletterMetrics;
}

export const NewsletterInsightsCard = ({ metrics }: NewsletterInsightsCardProps) => {
  const verificationRate =
    metrics.totalSubscribers > 0
      ? ((metrics.activeSubscribers / metrics.totalSubscribers) * 100).toFixed(0)
      : '100';

  return (
    <Card className="relative overflow-hidden border-border/80 bg-card/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0A1124]/90 shadow-lg flex flex-col justify-between h-full">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Email Outreach Engine</CardTitle>
              <p className="text-xs text-muted-foreground">
                Resend delivery, subscriber growth & transaction logs
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/newsletter"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Manage Outreach <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Top 4 Metric Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricItem
              icon={Send}
              label="Total Sent"
              value={formatNumber(metrics.totalEmailsSent)}
              color="text-primary"
              bg="bg-primary/10 border-primary/20"
            />
            <MetricItem
              icon={Users}
              label="Subscribers"
              value={metrics.totalSubscribers}
              color="text-emerald-500"
              bg="bg-emerald-500/10 border-emerald-500/20"
            />
            <MetricItem
              icon={Radio}
              label="Broadcasts"
              value={metrics.broadcastsSent}
              color="text-sky-500"
              bg="bg-sky-500/10 border-sky-500/20"
            />
            <MetricItem
              icon={UserCheck}
              label="Active Readers"
              value={metrics.activeSubscribers}
              color="text-teal-400"
              bg="bg-teal-500/10 border-teal-500/20"
            />
          </div>

          {/* Verification Health Rate Banner */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 dark:border-slate-800/60 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Double Opt-in Subscriber Health
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Verified active readership conversion across total signup requests
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-extrabold text-emerald-400">
                  {verificationRate}%
                </span>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-700"
                style={{ width: `${Math.min(Math.max(Number(verificationRate), 5), 100)}%` }}
              />
            </div>
          </div>

          {/* Email Type Dispatch Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/30">
              <span className="text-[11px] text-muted-foreground block truncate">Broadcasts</span>
              <p className="text-base font-bold font-mono text-foreground mt-1">
                {metrics.broadcastsSent}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/30">
              <span className="text-[11px] text-muted-foreground block truncate">
                Confirmations
              </span>
              <p className="text-base font-bold font-mono text-foreground mt-1">
                {metrics.verificationsSent}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/30">
              <span className="text-[11px] text-muted-foreground block truncate">
                Welcome Series
              </span>
              <p className="text-base font-bold font-mono text-foreground mt-1">
                {metrics.welcomeSent}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/30">
              <span className="text-[11px] text-muted-foreground block truncate">Contact Form</span>
              <p className="text-base font-bold font-mono text-foreground mt-1">
                {metrics.contactMessagesSent}
              </p>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Card Footer Micro-insights */}
      <div className="px-6 py-3 border-t border-border/50 bg-muted/10 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          Sender Domain:{' '}
          <code className="text-[10px] text-foreground font-mono">contact.ismailjosim.com</code>
        </span>
        <span className="font-mono font-semibold text-primary">
          {metrics.totalEmailsSent} total delivery events
        </span>
      </div>
    </Card>
  );
};

interface MetricItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}

const MetricItem = ({ icon: Icon, label, value, color, bg }: MetricItemProps) => (
  <div className="rounded-xl border border-border/60 bg-muted/20 p-3 dark:border-slate-800/60 dark:bg-slate-950/30 transition-all hover:bg-muted/40">
    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
      <div className={`flex h-5 w-5 items-center justify-center rounded-md border ${bg}`}>
        <Icon className={`h-3 w-3 ${color}`} />
      </div>
      <span className="text-[11px] font-medium truncate">{label}</span>
    </div>
    <p className="text-lg font-bold font-mono text-foreground mt-0.5">{value}</p>
  </div>
);

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
