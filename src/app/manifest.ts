import { MetadataRoute } from 'next';
import { siteConfig } from '@/src/constants/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Full Stack Developer & Senior Instructor`,
    short_name: `${siteConfig.shortName} Dev`,
    description: siteConfig.bio,
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0F17',
    theme_color: '#01B4BA',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
