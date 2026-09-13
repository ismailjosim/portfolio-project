import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Compass,
  ExternalLink,
  Github,
  Layers3,
  Monitor,
  Rocket,
  Terminal,
} from 'lucide-react';

import Footer from '@/src/components/shared/Footer';
import Navbar from '@/src/components/shared/Navbar';
import ScrollToTop from '@/src/components/ui/ScrollToTop';
import { Button } from '@/src/components/ui/button';
import { formatDateTime } from '@/src/lib/formatters.ts';
import { getSingleProjectBySlug } from '@/src/services/project-management';

import type { Metadata } from 'next';
import { siteConfig } from '@/src/constants/site-config';
import { BreadcrumbJsonLd, SoftwareAppJsonLd } from '@/src/components/seo/JsonLd';

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSingleProjectBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: 'Project Not Found',
      description: 'The requested project case study could not be found.',
    };
  }

  const project = result.data;
  const pageTitle = `${project.title || project.name} — Project Case Study`;
  const pageDescription =
    project.subtitle ||
    project.description ||
    `Explore ${project.name} built with ${project.technologies?.slice(0, 5).join(', ')}. Engineered by ${siteConfig.name}.`;

  const ogImages = project.image
    ? [{ url: project.image, alt: project.name }]
    : ['/opengraph-image'];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      project.name,
      ...(project.technologies || []),
      'Case Study',
      'Web Development',
      'Full Stack Project',
      'Software Engineering',
    ],
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${siteConfig.url}/projects/${slug}`,
      type: 'article',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: project.image ? [project.image] : ['/opengraph-image'],
    },
  };
}

function getRepoLinks(project: {
  githubUrl?: string;
  caseStudyUrl?: string;
  serverGithubUrl?: string;
}) {
  const repoUrls = [project.githubUrl, project.serverGithubUrl, project.caseStudyUrl].filter(
    (url): url is string => Boolean(url && url.includes('github.com'))
  );

  const clientRepoUrl =
    repoUrls.find((url) => url.toLowerCase().includes('client')) ||
    repoUrls.find((url) => !url.toLowerCase().includes('server'));

  const serverRepoUrl =
    [
      project.serverGithubUrl,
      project.caseStudyUrl,
      repoUrls.find((url) => url.toLowerCase().includes('server')),
    ].find((url) => url && url.includes('github.com') && url !== clientRepoUrl) || undefined;

  return {
    clientRepoUrl,
    serverRepoUrl,
    hasMultipleRepos: new Set([clientRepoUrl, serverRepoUrl].filter(Boolean)).size > 1,
  };
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { slug } = await params;
  const result = await getSingleProjectBySlug(slug);

  if (!result.success || !result.data) {
    return (
      <>
        <header>
          <Navbar />
        </header>
        <main className="flex min-h-screen items-center justify-center px-6 pt-28">
          <div className="max-w-md text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Project not found
            </p>
            <h1 className="mb-4 text-4xl font-bold">This project is unavailable</h1>
            <p className="mb-8 text-muted-foreground">
              {result.message || 'The project you are looking for may have been moved or deleted.'}
            </p>
            <Button asChild>
              <Link href="/all-projects">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const project = result.data;
  const features = (project.features || []) as string[];
  const technologies = (project.technologies || []) as string[];
  const screenshots = (project.demoImages || []) as string[];
  const previewImage = project.image || screenshots[0];
  const { clientRepoUrl, serverRepoUrl, hasMultipleRepos } = getRepoLinks(project);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Projects', url: '/all-projects' },
          { name: project.title || project.name, url: `/projects/${slug}` },
        ]}
      />
      <SoftwareAppJsonLd
        name={project.title || project.name}
        description={project.subtitle || project.description || ''}
        url={`/projects/${slug}`}
        image={previewImage}
        technologies={technologies}
      />
      <header>
        <Navbar />
      </header>

      <main className="min-h-screen bg-background px-6 pt-32 text-foreground">
        <section className="container mx-auto pb-20">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-8 px-0 text-muted-foreground">
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
          </div>

          {previewImage && (
            <div className="relative mb-10 h-65 overflow-hidden rounded-2xl border border-border bg-slate-950 md:h-130">
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

          <div className="mb-12 flex flex-wrap gap-3">
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

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
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
                      <div
                        key={feature}
                        className="flex gap-3 rounded-lg border border-border bg-card p-4"
                      >
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
                        key={imageUrl}
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

            <aside className="space-y-6 lg:col-span-4">
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
          </div>
        </section>
      </main>

      <ScrollToTop />
      <Footer />
    </>
  );
}
