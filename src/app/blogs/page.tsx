import { Metadata } from 'next';
import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { IBlog } from '@/src/types/blog.interface';

import { Input } from '@/src/components/ui/input';
import BlogCard from '@/src/components/blogs/BlogCard';
import BlogFilters from '@/src/components/blogs/BlogFilters';
import Navbar from '@/src/components/shared/Navbar';
import ScrollToTop from '@/src/components/ui/ScrollToTop';
import TablePagination from '@/src/components/shared/TablePagination';
import { BlogFilterSkeleton } from '@/src/components/shared/PublicDataSkeletons';
import { getPublishedBlogs } from '@/src/services/blog-management';

import { siteConfig } from '@/src/constants/site-config';
import { BreadcrumbJsonLd } from '@/src/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Engineering Articles & Technical Insights',
  description:
    'Deep dives into Full Stack development, Next.js, React 19, TypeScript, MongoDB architecture, API design, and practical software engineering tutorials by Md. Jasim.',
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: `Engineering Articles & Technical Insights | ${siteConfig.name}`,
    description:
      'Deep dives into Full Stack development, Next.js, React, TypeScript, and software architecture by Md. Jasim.',
    url: `${siteConfig.url}/blogs`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Engineering Articles & Technical Insights | ${siteConfig.name}`,
    description:
      'Deep dives into Full Stack development, Next.js, React, TypeScript, and software architecture by Md. Jasim.',
  },
};

export default async function BlogsPage(props: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    tag?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  // getPublishedBlogs hits /all-blog/public, which already filters to `published`
  // and orders by publishedAt.
  const result = await getPublishedBlogs({
    page: searchParams.page ? Number(searchParams.page) : undefined,
    limit: Number(searchParams.limit ?? 9),
    search: searchParams.search,
    category: searchParams.category,
    tag: searchParams.tag,
  });

  const blogs: IBlog[] = result?.data ?? [];
  const pagination = result?.pagination ?? null;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blogs' },
        ]}
      />
      <header>
        <Navbar />
      </header>

      <main className="min-h-screen">
        {/* HEADER */}
        <section className="py-20 bg-linear-to-b from-background via-background to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>

            <p className="text-lg text-muted-foreground mb-8">
              Explore my thoughts on technology, career, and more
            </p>

            {/* SEARCH (server-driven via URL) */}
            <form className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <Input
                name="search"
                type="search"
                defaultValue={searchParams.search || ''}
                placeholder="Search articles..."
                className="pl-12 py-3 text-lg"
              />
            </form>

            <div className="mt-8">
              <Suspense fallback={<BlogFilterSkeleton />}>
                <BlogFilters />
              </Suspense>
            </div>
          </div>
        </section>

        {/* BLOG GRID */}
        <section className="py-12">
          <div className="container mx-auto">
            {blogs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No published articles yet. Check back soon!
                </p>
              </div>
            ) : (
              <>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
                  {blogs.map((blog: IBlog, index: number) => (
                    <BlogCard blog={blog} key={blog._id} index={index} />
                  ))}
                </div>

                {/* PAGINATION */}
                {pagination && (
                  <div className="mt-12 py-20">
                    <TablePagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <ScrollToTop />
    </>
  );
}
