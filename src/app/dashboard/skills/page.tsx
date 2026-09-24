import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TableSkeleton } from '../../../components/shared/TableSkeleton';
import TablePagination from '../../../components/shared/TablePagination';
import SkillManagementHeader from '@/src/components/modules/skillsManagement/SkillManagementHeader';
import SkillsTable from '@/src/components/modules/skillsManagement/SkillsTable';
import SkillFilter from '@/src/components/modules/skillsManagement/SkillFilter';
import { getAllSkills } from '@/src/services/skill-management';

export const metadata: Metadata = {
  title: 'Skills Management',
  description:
    'Manage technical competencies, categories, proficiency rankings, and icon mappings.',
};

const SkillsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const skillsResult = await getAllSkills({
    page: searchParamsObj.page ? Number(searchParamsObj.page) : undefined,
    limit: searchParamsObj.limit ? Number(searchParamsObj.limit) : undefined,
    category: typeof searchParamsObj.category === 'string' ? searchParamsObj.category : undefined,
    proficiency:
      typeof searchParamsObj.proficiency === 'string' ? searchParamsObj.proficiency : undefined,
    search: typeof searchParamsObj.searchTerm === 'string' ? searchParamsObj.searchTerm : undefined,
    sortBy: typeof searchParamsObj.sortBy === 'string' ? searchParamsObj.sortBy : undefined,
    orderBy: typeof searchParamsObj.orderBy === 'string' ? searchParamsObj.orderBy : undefined,
  });

  const totalPages = Math.ceil(
    (skillsResult?.pagination?.total || 1) / (skillsResult?.pagination?.limit || 1)
  );

  return (
    <div className="space-y-6">
      <SkillManagementHeader />

      {/* search filter */}
      <SkillFilter />

      <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
        <SkillsTable skills={skillsResult?.data || []} />
        <TablePagination
          currentPage={skillsResult?.pagination?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default SkillsPage;
