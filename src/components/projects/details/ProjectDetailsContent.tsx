import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Monitor, Rocket } from 'lucide-react';
import { IProject } from '@/src/types/project.interface';

interface ProjectDetailsContentProps {
  project: IProject;
  features: string[];
  screenshots: string[];
}

export const ProjectDetailsContent: React.FC<ProjectDetailsContentProps> = ({
  project,
  features,
  screenshots,
}) => {
  return (
    <div className="space-y-10 lg:col-span-8">
      {project.description && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <Rocket className="h-5 w-5 text-accent" />
            Project Overview
          </h2>
          <p className="text-base leading-8 text-muted-foreground">{project.description}</p>
        </section>
      )}

      {features.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Key Features
            </h2>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {features.length} total
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <p className="text-sm leading-7 text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {screenshots.length > 0 && (
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold">
            <Monitor className="h-5 w-5 text-accent" />
            Project Screenshots
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {screenshots.map((imageUrl, index) => (
              <div
                key={imageUrl + index}
                className="relative h-64 overflow-hidden rounded-xl border border-border bg-card"
              >
                <Image
                  src={imageUrl}
                  alt={`${project.name} screenshot ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectDetailsContent;
