import { MetadataRoute } from 'next';
import { siteConfig } from '@/src/constants/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
