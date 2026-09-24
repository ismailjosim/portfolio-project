import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TableSkeleton } from '../../../components/shared/TableSkeleton';
import TablePagination from '../../../components/shared/TablePagination';
import NewsletterManagementHeader from '@/src/components/modules/newsletterManagement/NewsletterManagementHeader';
import NewsletterStatCards from '@/src/components/modules/newsletterManagement/NewsletterStatCards';
import NewsletterFilter from '@/src/components/modules/newsletterManagement/NewsletterFilter';
import NewsletterTable from '@/src/components/modules/newsletterManagement/NewsletterTable';
import { listSubscribersForAdmin } from '@/src/services/newsletter-management';

export const metadata: Metadata = {
  title: 'Newsletter Subscribers',
  description: 'Manage newsletter subscribers, broadcast newsletters, and view subscription analytics.',
};

const DashboardNewsletterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const result = await listSubscribersForAdmin({
    page: searchParamsObj.page ? Number(searchParamsObj.page) : undefined,
    limit: searchParamsObj.limit ? Number(searchParamsObj.limit) : undefined,
    status: typeof searchParamsObj.status === 'string' ? searchParamsObj.status : undefined,
    search: typeof searchParamsObj.searchTerm === 'string' ? searchParamsObj.searchTerm : undefined,
    sortBy: typeof searchParamsObj.sortBy === 'string' ? searchParamsObj.sortBy : undefined,
    orderBy: typeof searchParamsObj.orderBy === 'string' ? searchParamsObj.orderBy : undefined,
  });

  const totalPages = result.pagination.totalPages;

  return (
    <div className="space-y-6">
      <NewsletterManagementHeader />

      <NewsletterStatCards stats={result.stats} />

      <NewsletterFilter />

      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <NewsletterTable subscribers={result.subscribers} />
        <TablePagination
          currentPage={result.pagination.page}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default DashboardNewsletterPage;
