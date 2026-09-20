import type { Metadata } from 'next';
import AllProjectsClientView from '@/src/components/modules/projects/AllProjectsClientView';
import { siteConfig } from '@/src/constants/site-config';

export const metadata: Metadata = {
  title: 'All Projects & Case Studies',
  description:
    'Explore full-stack web applications, SaaS platforms, and developer tooling engineered with clean architecture, robust testing, and modern design principles.',
  alternates: {
    canonical: '/all-projects',
  },
  openGraph: {
    title: `All Projects & Case Studies — ${siteConfig.name}`,
    description:
      'Explore full-stack web applications, SaaS platforms, and developer tooling engineered with clean architecture, robust testing, and modern design principles.',
    url: `${siteConfig.url}/all-projects`,
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `All Projects & Case Studies — ${siteConfig.name}`,
    description:
      'Explore full-stack web applications, SaaS platforms, and developer tooling engineered with clean architecture, robust testing, and modern design principles.',
    images: ['/opengraph-image'],
  },
};

export default function AllProjectsPage() {
  return <AllProjectsClientView />;
}
