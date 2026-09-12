'use client';

import Image from 'next/image';

import { DateCell } from '../../shared/DateCell';
import { IProject } from '@/src/types/project.interface';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortKey?: keyof T;
}

const projectColumns: Column<IProject>[] = [
  {
    header: 'Project',
    accessor: (project) => (
      <div className="flex items-center gap-3 min-w-[180px] max-w-[260px]">
        <div className="relative size-10 shrink-0 rounded-md overflow-hidden bg-muted">
          <Image
            src={
              project.image?.startsWith('blob')
                ? '/placeholder.jpg'
                : project.image || '/placeholder.jpg'
            }
            alt={project.title}
            fill
            className="rounded-md object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm truncate" title={project.title}>
            {project.title}
          </span>
          <span className="text-xs text-muted-foreground truncate">{project.type}</span>
        </div>
      </div>
    ),
    sortKey: 'title',
  },

  {
    header: 'Technologies',
    accessor: (project) => (
      <div className="text-sm flex flex-wrap gap-1 max-w-[200px]">
        {project.technologies?.slice(0, 3).map((tech, idx) => (
          <span
            key={idx}
            className="bg-muted text-muted-foreground border border-border/50 px-2 py-0.5 rounded text-xs"
          >
            {tech}
          </span>
        ))}
        {project.technologies && project.technologies.length > 3 && (
          <span className="text-muted-foreground/75 text-xs self-center">
            +{project.technologies.length - 3}
          </span>
        )}
      </div>
    ),
  },

  {
    header: 'Featured',
    accessor: (project) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${
          project.featured
            ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
            : 'bg-muted text-muted-foreground border-border/50'
        }`}
      >
        {project.featured ? 'Yes' : 'No'}
      </span>
    ),
    sortKey: 'featured',
  },

  {
    header: 'Published',
    accessor: (project) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${
          project.isPublished
            ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
            : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
        }`}
      >
        {project.isPublished ? 'Published' : 'Draft'}
      </span>
    ),
    sortKey: 'isPublished',
  },

  {
    header: 'Created',
    accessor: (project) => <DateCell date={project.createdAt} />,
    sortKey: 'createdAt',
  },
];
export default projectColumns;
