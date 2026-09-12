import { Skeleton } from '@/src/components/ui/skeleton';

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6 pb-8 animate-in fade-in-50 duration-300">
      {/* ── Welcome Banner Skeleton ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-6 shadow-xl dark:border-slate-800/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>

            <Skeleton className="h-8 sm:h-9 w-64 sm:w-80 rounded-lg" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* ── Key KPI Bento Stats Grid Skeleton ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-sm space-y-3 dark:border-slate-800/80"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>

            <Skeleton className="h-3 w-40 rounded-md pt-1" />
          </div>
        ))}
      </div>

      {/* ── Content & Articles Showcase Row Skeleton ── */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {/* Blog Intelligence Card Skeleton */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm space-y-6 dark:border-slate-800/80">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-3.5 w-64 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* 3 Metric blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-20 rounded-md" />
                  <Skeleton className="size-4 rounded-full" />
                </div>
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            ))}
          </div>

          {/* Bottom bars */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        </div>

        {/* Recent Blogs Card Skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm space-y-5 dark:border-slate-800/80">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-5 w-28 rounded-md" />
            </div>
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          {/* Blog List Items */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-4 w-4/5 rounded-md" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16 rounded-md" />
                    <Skeleton className="h-3 w-12 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Engineering & Skills Matrix Row Skeleton ── */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {/* Skills Insights Card Skeleton */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm space-y-5 dark:border-slate-800/80">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-44 rounded-md" />
                <Skeleton className="h-3.5 w-56 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                  <Skeleton className="h-3.5 w-8 rounded-md" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Projects Overview Card Skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm space-y-5 dark:border-slate-800/80">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/50 bg-muted/15 p-3.5 space-y-2.5"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-4 w-14 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
