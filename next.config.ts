import type { NextConfig } from 'next';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
  img-src 'self' blob: data: https://res.cloudinary.com https://avatars.githubusercontent.com https://raw.githubusercontent.com https://images.unsplash.com https://utfs.io https://www.ismailjosim.com https://ghchart.rshah.org https://github-readme-stats.vercel.app;
  font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://va.vercel-scripts.com https://api.github.com https://res.cloudinary.com https://github-contributions-api.jogruber.de;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'www.ismailjosim.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
