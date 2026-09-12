import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { BlogGridSkeleton, CommentsSkeleton } from '@/src/components/shared/PublicDataSkeletons';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Separator } from '@/src/components/ui/separator';

export default function BlogDetailsLoading() {
  return (
    <>
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          <Skeleton className="mb-10 h-60 w-full rounded-2xl md:h-96" />

          <div className="mb-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-4/5" />
            </div>

            <div className="flex flex-wrap gap-6 border-b pb-6">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          <Separator />

          <div className="mt-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-10/12" />
            <Skeleton className="h-5 w-full" />
          </div>

          <div className="my-10 flex flex-wrap gap-4 border-y py-6">
            <Skeleton className="h-11 w-28" />
            <Skeleton className="h-11 w-32" />
          </div>

          <CommentsSkeleton />
        </article>

        <div className="mt-20">
          <section className="max-w-4xl mx-auto">
            <Skeleton className="mb-8 h-8 w-48" />
            <BlogGridSkeleton count={3} />
          </section>
        </div>
      </main>
    </>
  );
}
