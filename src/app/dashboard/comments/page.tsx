import type { Metadata } from 'next';
import { Suspense } from 'react';
import { listCommentsForAdmin } from '../../../services/comment-admin';
import { TableSkeleton } from '../../../components/shared/TableSkeleton';
import TablePagination from '../../../components/shared/TablePagination';
import ManagementPageHeader from '../../../components/shared/ManagementPageHeader';
import CommentsFilter from '../../../components/modules/commentsManagement/CommentsFilter';
import CommentsTable from '../../../components/modules/commentsManagement/CommentsTable';

export const metadata: Metadata = {
  title: 'Comments Management',
  description: 'Moderate blog reader comments, reviews, feedback, and discussion threads.',
};

const asString = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : undefined;

const DashboardCommentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;

  const result = await listCommentsForAdmin({
    page: searchParamsObj.page ? Number(searchParamsObj.page) : undefined,
    limit: searchParamsObj.limit ? Number(searchParamsObj.limit) : undefined,
    status: asString(searchParamsObj.status),
    blogId: asString(searchParamsObj.blogId),
    search: asString(searchParamsObj.searchTerm),
    sortBy: asString(searchParamsObj.sortBy),
    orderBy: asString(searchParamsObj.orderBy),
  });

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title="All Comments"
        description="Moderate reader comments — hide spam or restore it"
      />

      <CommentsFilter />

      <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
        <CommentsTable comments={result.comments} />
        <TablePagination
          currentPage={result.pagination.page}
          totalPages={result.pagination.totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default DashboardCommentsPage;
