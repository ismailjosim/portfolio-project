import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TableSkeleton } from '../../../components/shared/TableSkeleton';
import TablePagination from '../../../components/shared/TablePagination';
import NewsletterManagementHeader from '@/src/components/modules/newsletterManagement/NewsletterManagementHeader';
import NewsletterStatCards from '@/src/components/modules/newsletterManagement/NewsletterStatCards';
import NewsletterFilter from '@/src/components/modules/newsletterManagement/NewsletterFilter';
import NewsletterTable from '@/src/components/modules/newsletterManagement/NewsletterTable';
import NewsletterTemplatesTable from '@/src/components/modules/newsletterManagement/NewsletterTemplatesTable';
import {
  listSubscribersForAdmin,
  listTemplatesForAdmin,
} from '@/src/services/newsletter-management';

export const metadata: Metadata = {
  title: 'Newsletter Subscribers & Templates',
  description:
    'Manage newsletter subscribers, broadcast newsletters, and view reusable email templates.',
};

const DashboardNewsletterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const isTemplatesTab = searchParamsObj.tab === 'templates';

  // Always fetch subscriber stats for header count badges and overview
  const subscribersResult = await listSubscribersForAdmin({
    page: !isTemplatesTab && searchParamsObj.page ? Number(searchParamsObj.page) : 1,
    limit: !isTemplatesTab && searchParamsObj.limit ? Number(searchParamsObj.limit) : 10,
    status: typeof searchParamsObj.status === 'string' ? searchParamsObj.status : undefined,
    search:
      !isTemplatesTab && typeof searchParamsObj.searchTerm === 'string'
        ? searchParamsObj.searchTerm
        : undefined,
    sortBy:
      !isTemplatesTab && typeof searchParamsObj.sortBy === 'string'
        ? searchParamsObj.sortBy
        : undefined,
    orderBy:
      !isTemplatesTab && typeof searchParamsObj.orderBy === 'string'
        ? searchParamsObj.orderBy
        : undefined,
  });

  const templatesResult = isTemplatesTab
    ? await listTemplatesForAdmin({
        page: searchParamsObj.page ? Number(searchParamsObj.page) : 1,
        limit: searchParamsObj.limit ? Number(searchParamsObj.limit) : 10,
        search:
          typeof searchParamsObj.searchTerm === 'string' ? searchParamsObj.searchTerm : undefined,
        sortBy: typeof searchParamsObj.sortBy === 'string' ? searchParamsObj.sortBy : undefined,
        orderBy: typeof searchParamsObj.orderBy === 'string' ? searchParamsObj.orderBy : undefined,
      })
    : null;

  const activePage = isTemplatesTab
    ? templatesResult?.pagination.page || 1
    : subscribersResult.pagination.page;
  const totalPages = isTemplatesTab
    ? templatesResult?.pagination.totalPages || 1
    : subscribersResult.pagination.totalPages || 1;

  return (
    <div className="space-y-6">
      <NewsletterManagementHeader
        currentTab={isTemplatesTab ? 'templates' : 'subscribers'}
        templateCount={subscribersResult.stats.templateCount}
        subscriberCount={subscribersResult.stats.total}
      />

      <NewsletterStatCards stats={subscribersResult.stats} />

      <NewsletterFilter />

      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        {isTemplatesTab && templatesResult ? (
          <NewsletterTemplatesTable templates={templatesResult.templates} />
        ) : (
          <NewsletterTable subscribers={subscribersResult.subscribers} />
        )}
        <TablePagination currentPage={activePage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
};

export default DashboardNewsletterPage;
