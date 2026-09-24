import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

import Footer from '@/src/components/shared/Footer';
import Navbar from '@/src/components/shared/Navbar';
import ScrollToTop from '@/src/components/ui/ScrollToTop';
import { Button } from '@/src/components/ui/button';
import { getSingleProjectBySlug } from '@/src/services/project-management';
import { siteConfig } from '@/src/constants/site-config';
import { BreadcrumbJsonLd, SoftwareAppJsonLd } from '@/src/components/seo/JsonLd';

import ProjectDetailsHeader from '@/src/components/projects/details/ProjectDetailsHeader';
import ProjectDetailsContent from '@/src/components/projects/details/ProjectDetailsContent';
import ProjectDetailsSidebar from '@/src/components/projects/details/ProjectDetailsSidebar';
import NewsletterSubscribeBox from '@/src/components/newsletter/NewsletterSubscribeBox';

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
          <ProjectDetailsHeader
            project={project}
            previewImage={previewImage}
            clientRepoUrl={clientRepoUrl}
            serverRepoUrl={serverRepoUrl}
            hasMultipleRepos={hasMultipleRepos}
          />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <ProjectDetailsContent
              project={project}
              features={features}
              screenshots={screenshots}
            />
            <ProjectDetailsSidebar project={project} technologies={technologies} />
          </div>

          {/* Newsletter Subscribe Callout */}
          <div className="mt-14">
            <NewsletterSubscribeBox variant="project" />
          </div>
        </section>
      </main>

      <ScrollToTop />
      <Footer />
    </>
  );
}
