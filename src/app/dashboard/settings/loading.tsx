import { Skeleton } from '@/src/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-6 pb-8">
      <Skeleton className="h-36 w-full rounded-3xl" />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
