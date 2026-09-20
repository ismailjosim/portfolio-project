import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllBlogs } from '../../../services/blog-management';
import { TableSkeleton } from '../../../components/shared/TableSkeleton';
import TablePagination from '../../../components/shared/TablePagination';
import BlogsFilter from '../../../components/modules/blogsManagement/BlogsFilter';
import BlogsTable from '../../../components/modules/blogsManagement/BlogsTable';
import BlogManagementHeader from '@/src/components/modules/blogsManagement/BlogManagementHeader';

export const metadata: Metadata = {
  title: 'Blog Management',
  description: 'Manage, publish, schedule, and organize portfolio blog articles.',
};

const DashboardBlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const blogsResult = await getAllBlogs({
    page: searchParamsObj.page ? Number(searchParamsObj.page) : undefined,
    limit: searchParamsObj.limit ? Number(searchParamsObj.limit) : undefined,
    category: typeof searchParamsObj.category === 'string' ? searchParamsObj.category : undefined,
    tag: typeof searchParamsObj.tag === 'string' ? searchParamsObj.tag : undefined,
    search: typeof searchParamsObj.searchTerm === 'string' ? searchParamsObj.searchTerm : undefined,
    sortBy: typeof searchParamsObj.sortBy === 'string' ? searchParamsObj.sortBy : undefined,
    orderBy: typeof searchParamsObj.orderBy === 'string' ? searchParamsObj.orderBy : undefined,
  });

  const totalPages = Math.ceil(
    (blogsResult?.pagination?.total || 1) / (blogsResult?.pagination?.limit || 1)
  );

  return (
    <div className="space-y-6">
      <BlogManagementHeader />

      {/* search filter */}
      <BlogsFilter />

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <BlogsTable blogs={blogsResult?.data || []} />
        <TablePagination
          currentPage={blogsResult?.pagination?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default DashboardBlogPage;
