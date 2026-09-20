import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Compass, ExternalLink, Github, Layers3, Terminal } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { IProject } from '@/src/types/project.interface';

interface ProjectDetailsHeaderProps {
  project: IProject;
  previewImage?: string;
  clientRepoUrl?: string;
  serverRepoUrl?: string;
  hasMultipleRepos?: boolean;
}

export const ProjectDetailsHeader: React.FC<ProjectDetailsHeaderProps> = ({
  project,
  previewImage,
  clientRepoUrl,
  serverRepoUrl,
  hasMultipleRepos,
}) => {
  return (
    <div className="mb-12">
      <Button asChild variant="ghost" className="mb-8 px-0 text-muted-foreground cursor-pointer">
        <Link href="/all-projects">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          {project.type || 'Project'}
        </span>
        {project.featured && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Layers3 className="h-3.5 w-3.5" />
            Featured
          </span>
        )}
      </div>

      <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
        {project.title || project.name}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
        {project.subtitle || project.description}
      </p>

      {previewImage && (
        <div className="relative mt-8 mb-10 h-65 overflow-hidden rounded-2xl border border-border bg-slate-950 md:h-130">
          <Image
            src={previewImage}
            alt={`${project.name} project preview`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {project.liveUrl && (
          <Button asChild size="lg">
            <Link href={project.liveUrl} target="_blank" rel="noreferrer">
              <Compass className="h-4 w-4" />
              Live Preview
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        )}

        {clientRepoUrl && (
          <Button asChild size="lg" variant="outline">
            <Link href={clientRepoUrl} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              {hasMultipleRepos ? 'Client Repo' : 'Repo Link'}
            </Link>
          </Button>
        )}

        {serverRepoUrl && (
          <Button asChild size="lg" variant="outline">
            <Link href={serverRepoUrl} target="_blank" rel="noreferrer">
              <Terminal className="h-4 w-4" />
              {hasMultipleRepos ? 'Server Repo' : 'Repo Link'}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsHeader;
