'use client';

import { LucideIcon, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  subValue?: string;
  badge?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  href?: string;
}

export const StatsCard = ({
  icon: Icon,
  label,
  value,
  description,
  subValue,
  badge,
  trend,
  href,
}: StatsCardProps) => {
  const content = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full',
        'hover:border-primary/40',
        'dark:bg-[#0A1124]/90 dark:border-slate-800/80'
      )}
    >
      {/* Background Accent Gradient */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-linear-to-br from-primary/10 via-accent/5 to-transparent blur-2xl transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-2.5 sm:gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
              {label}
            </span>
            {badge && (
              <span className="rounded-full border px-1.5 py-0.2 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-semibold bg-primary/10 text-primary border-primary/20 shrink-0">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5 pt-1 min-w-0">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono truncate">
              {value}
            </h3>
            {subValue && (
              <span className="text-xs font-medium text-muted-foreground truncate">
                ({subValue})
              </span>
            )}
          </div>
        </div>

        <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 bg-primary/10 text-primary border-primary/20">
          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* Footer Info / Trend */}
      <div className="relative z-10 mt-3 sm:mt-4 flex items-center justify-between border-t border-border/50 pt-2.5 sm:pt-3 text-[11px] sm:text-xs text-muted-foreground dark:border-slate-800/60 min-w-0">
        <div className="truncate flex-1 min-w-0 mr-1.5">
          {description && <span title={description}>{description}</span>}
        </div>

        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 font-semibold shrink-0',
              trend.isPositive
                ? 'text-emerald-500 dark:text-emerald-400'
                : 'text-rose-500 dark:text-rose-400'
            )}
          >
            <span>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            {trend.label && (
              <span className="font-normal text-muted-foreground hidden sm:inline">
                {trend.label}
              </span>
            )}
          </div>
        )}

        {href && (
          <span className="flex items-center gap-0.5 text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 font-medium shrink-0">
            View <ArrowUpRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
