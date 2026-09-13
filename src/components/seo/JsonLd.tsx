import { siteConfig } from '@/src/constants/site-config';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function PersonJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    jobTitle: siteConfig.role,
    description: siteConfig.bio,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.photo}`,
    sameAs: [
      siteConfig.socials.github,
      siteConfig.socials.linkedin,
      siteConfig.socials.twitter,
      siteConfig.socials.facebook,
    ],
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
      url: siteConfig.organization.url,
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'National University, Bangladesh',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressCountry: siteConfig.location.country,
    },
    knowsAbout: siteConfig.skills,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${siteConfig.name} Portfolio`,
    url: siteConfig.url,
    description: siteConfig.bio,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/blogs?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogPostingJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  tags,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  tags?: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    url: url.startsWith('http') ? url : `${siteConfig.url}${url}`,
    image: image || `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || datePublished || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.avatar}`,
      },
    },
    keywords: tags?.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.startsWith('http') ? url : `${siteConfig.url}${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareAppJsonLd({
  name,
  description,
  url,
  image,
  technologies,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  technologies?: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    description: description,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: url.startsWith('http') ? url : `${siteConfig.url}${url}`,
    screenshot: image,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    keywords: technologies?.join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
