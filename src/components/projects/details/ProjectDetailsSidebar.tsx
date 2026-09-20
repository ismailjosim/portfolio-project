import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDateTime } from '@/src/lib/formatters.ts';
import { IProject } from '@/src/types/project.interface';

interface ProjectDetailsSidebarProps {
  project: IProject;
  technologies: string[];
}

export const ProjectDetailsSidebar: React.FC<ProjectDetailsSidebarProps> = ({
  project,
  technologies,
}) => {
  return (
    <aside className="space-y-6 lg:col-span-4">
      {technologies.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold">Project Info</h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Project Name</dt>
            <dd className="mt-1 font-medium">{project.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Type</dt>
            <dd className="mt-1 font-medium">{project.type}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-1 font-medium">
              {project.isPublished === false ? 'Draft' : 'Published'}
            </dd>
          </div>
          {project.createdAt && (
            <div>
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created
              </dt>
              <dd className="mt-1 font-medium">{formatDateTime(project.createdAt)}</dd>
            </div>
          )}
        </dl>
      </section>
    </aside>
  );
};

export default ProjectDetailsSidebar;
