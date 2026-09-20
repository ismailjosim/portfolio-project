import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectFilter from '@/src/components/modules/projectsManagement/ProjectFilter';
import ProjectManagementHeader from '@/src/components/modules/projectsManagement/ProjectManagementHeader';
import ProjectsTable from '@/src/components/modules/projectsManagement/ProjectsTable';
import TablePagination from '@/src/components/shared/TablePagination';
import { TableSkeleton } from '@/src/components/shared/TableSkeleton';
import { queryStringFormatter } from '@/src/lib/formatters.ts';
import { getAllProjects } from '@/src/services/project-management';

export const metadata: Metadata = {
  title: 'Projects Management',
  description: 'Manage showcase projects, live demos, repositories, and case studies.',
};

const ProjectsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const projectResult = await getAllProjects(queryString);

  const totalPages = Math.ceil(
    (projectResult?.pagination?.total || 1) / (projectResult?.pagination?.limit || 1)
  );

  return (
    <div className="space-y-6">
      <ProjectManagementHeader />
      <ProjectFilter />

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <ProjectsTable projects={projectResult?.data || []} />
        <TablePagination
          currentPage={projectResult?.pagination?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default ProjectsPage;
