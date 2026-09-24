'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Activity, ArrowRight, Github, Layers3, Terminal, Compass } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { type ProjectCardProject, getTechIcon, getProjectLinks } from './projectCardUtils';

export type { ProjectCardProject };

interface ProjectShowcaseCardProps {
  project: ProjectCardProject;
  reverse?: boolean;
  priority?: boolean;
}

export default function ProjectShowcaseCard({
  project,
  reverse = false,
  priority = false,
}: ProjectShowcaseCardProps) {
  // const [featuresExpanded, setFeaturesExpanded] = useState(false);
  // const features = project.features;
  // const visibleFeatures = features.slice(0, 5);
  // const hiddenFeatures = features.slice(5);
  const technologies = project.technologies;
  const subtitle = project.subtitle || 'A feature-rich web platform.';
  const fullDescription = project.description || project.title || subtitle;
  const isLongDescription = fullDescription.length > 200;
  const truncatedDescription = isLongDescription
    ? fullDescription.substring(0, 200)
    : fullDescription;
  const previewImage = project.image || project.demoImages?.[0];

  const { liveSiteUrl, clientRepoUrl, serverRepoUrl, hasMultipleRepos } = getProjectLinks(project);

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10 active:scale-[0.99] active:shadow-md dark:border-slate-800/60 dark:bg-[#0B1329] dark:text-slate-100 dark:hover:border-primary/30 dark:hover:shadow-primary/5',
        reverse && 'lg:[&>div>.project-visual]:order-2'
      )}
    >
      <div className="relative grid grid-cols-1 lg:grid-cols-12">
        {/* Left Full Width Visual Showcase Column */}
        <div className="project-visual relative flex min-h-80 flex-col justify-between overflow-hidden border-b border-border bg-slate-950 lg:col-span-5 lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-[#070D1E]">
          {/* Bleeding Background Image Layer */}
          {previewImage && (
            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
              <Image
                src={previewImage}
                alt={`${project.name} Visual Artwork`}
                fill
                priority={priority}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover mix-blend-luminosity transition-all duration-700 ease-out group-hover:scale-105 group-hover:mix-blend-normal"
              />
              {/* Dark overlays to maintain text readability over any background image */}
              <div className="absolute inset-0 bg-slate-950/75 transition-opacity duration-500 group-hover:opacity-70 dark:bg-[#070D1E]/80 dark:group-hover:opacity-75" />
              <div className="absolute inset-0 bg-linear-to-t from-[#070D1E] via-transparent to-[#070D1E]/40" />
            </div>
          )}

          {/* Glow effects (placed behind text, over image layer) */}
          <div className="absolute right-0 top-0 z-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />

          {/* Header Action Badges - Isolated with internal padding */}
          <div className="relative z-10 flex items-center justify-between p-6">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
              Production Ready
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 font-mono text-[11px] text-primary backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90 dark:text-primary">
              <Layers3 className="h-3 w-3" />
              Featured
            </div>
          </div>

          {/* Centered Identity Layout Wrapper */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-8 my-auto">
            <h3 className="max-w-sm lg:max-w-xs text-2xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {project.name}
            </h3>
            <p className="mt-3 max-w-sm lg:max-w-xs text-balance text-xs font-normal leading-relaxed text-slate-200 drop-shadow-md dark:text-slate-300">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Details/Documentation Column */}
        <div className="relative flex flex-col justify-between bg-card p-6 sm:p-8 lg:col-span-7 dark:bg-[#0A1124]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl dark:bg-primary/5" />

          <div className="relative">
            {/* Project Framework Header Label */}
            <div className="mb-5 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <span className="inline-flex rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent dark:border-primary/30 dark:bg-primary/10 dark:text-primary">
                  {project.type || 'Full Stack Web Application'}
                </span>
                <h2 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground dark:text-white">
                  {project.name}
                </h2>
              </div>
              {/* Action Navigation Layout */}
              {(liveSiteUrl || clientRepoUrl || serverRepoUrl || project.slug) && (
                <div className="flex w-full flex-wrap items-center justify-between gap-2.5 xl:w-md">
                  {liveSiteUrl && (
                    <Button
                      asChild
                      className="group/btn h-9 min-w-30 flex-1 rounded-lg border border-primary/40 bg-primary/10 px-3 font-mono text-[11px] uppercase tracking-wider text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-primary/20 hover:shadow-lg active:scale-95 cursor-pointer"
                    >
                      <a
                        href={liveSiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5"
                      >
                        <Compass className="h-3.5 w-3.5 transition-transform duration-500 group-hover/btn:rotate-180" />
                        <span>Live Preview</span>
                      </a>
                    </Button>
                  )}
                  {clientRepoUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="h-9 min-w-24 flex-1 rounded-md border-border bg-background/70 px-2.5 text-xs font-semibold text-foreground hover:border-accent/50 hover:bg-accent/10 hover:text-accent active:scale-95 cursor-pointer dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-primary/50 dark:hover:bg-slate-900 dark:hover:text-primary"
                    >
                      <a
                        href={clientRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-primary">
                          <Github className="h-3 w-3" />
                        </span>
                        <span>{hasMultipleRepos ? 'Client Repo' : 'Repo Link'}</span>
                      </a>
                    </Button>
                  )}
                  {serverRepoUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="h-9 min-w-24 flex-1 rounded-md border-border bg-background/70 px-2.5 text-xs font-semibold text-foreground hover:border-accent/50 hover:bg-accent/10 hover:text-accent active:scale-95 cursor-pointer dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-primary/50 dark:hover:bg-slate-900 dark:hover:text-primary"
                    >
                      <a
                        href={serverRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-primary">
                          <Terminal className="h-3 w-3" />
                        </span>
                        <span>{hasMultipleRepos ? 'Server Repo' : 'Repo Link'}</span>
                      </a>
                    </Button>
                  )}
                  {project.slug && (
                    <Button
                      asChild
                      variant="outline"
                      className="h-9 min-w-24 flex-1 rounded-md border-border bg-background/70 px-2.5 text-xs font-semibold text-foreground hover:border-accent/50 hover:bg-accent/10 hover:text-accent active:scale-95 cursor-pointer dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-primary/50 dark:hover:bg-slate-900 dark:hover:text-primary"
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center justify-center gap-1.5"
                      >
                        <span>Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
            {/* Comprehensive Meta-Description */}
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground dark:text-slate-300">
              {truncatedDescription}
              {isLongDescription && project.slug && (
                <>
                  <span className="text-muted-foreground/60">...</span>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="ml-1 font-medium text-accent hover:underline dark:text-primary"
                  >
                    full info
                  </Link>
                </>
              )}
            </p>

            {/* System Technology Ecosystem Architecture Badges */}
            {technologies.length > 0 && (
              <div className="mb-8">
                <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-400">
                  <Activity className="h-3.5 w-3.5 text-accent dark:text-primary" />
                  Powered By Tech Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech) => {
                    const Icon = getTechIcon(tech);
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/70 px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-primary/40 dark:hover:bg-primary/5"
                      >
                        <Icon className="h-3.5 w-3.5 text-accent/80 dark:text-primary/80" />
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
