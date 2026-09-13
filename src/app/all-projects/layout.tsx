import type { Metadata } from 'next';
import { siteConfig } from '@/src/constants/site-config';
import { BreadcrumbJsonLd } from '@/src/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'All Projects & Engineering Case Studies',
  description:
    'Browse the complete catalog of full stack web applications, SaaS products, open-source projects, and client solutions engineered by Md. Jasim.',
  alternates: {
    canonical: '/all-projects',
  },
  openGraph: {
    title: `All Projects & Engineering Case Studies | ${siteConfig.name}`,
    description:
      'Browse the complete catalog of full stack web applications, SaaS products, and open-source projects engineered by Md. Jasim.',
    url: `${siteConfig.url}/all-projects`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `All Projects & Engineering Case Studies | ${siteConfig.name}`,
    description:
      'Browse the complete catalog of full stack web applications, SaaS products, and open-source projects engineered by Md. Jasim.',
  },
};

export default function AllProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Projects', url: '/all-projects' },
        ]}
      />
      {children}
    </>
  );
}
