import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import { TooltipProvider } from '../components/ui/tooltip';
import { ThemeProvider } from '../providers/theme-provider';
import { CustomThemeProvider } from '../providers/custom-theme-provider';
import { getGlobalThemeSettings } from '../lib/theme-settings';

import { siteConfig } from '../constants/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.headline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.bio,
  applicationName: `${siteConfig.name} Portfolio`,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    title: `${siteConfig.name} — ${siteConfig.headline}`,
    description: siteConfig.bio,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.role}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.headline}`,
    description: siteConfig.bio,
    creator: '@ismail_josim',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/ismailjosim.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  category: 'technology',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global theme, resolved on the server so the first paint is already correct.
  const themeSettings = await getGlobalThemeSettings();

  return (
    <html
      lang="en"
      data-palette={themeSettings.palette}
      data-font={themeSettings.font}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme={themeSettings.themeMode} enableSystem>
          <CustomThemeProvider
            initialPalette={themeSettings.palette}
            initialFont={themeSettings.font}
            initialThemeMode={themeSettings.themeMode}
            initialUpdatedAt={themeSettings.updatedAt}
          >
            <TooltipProvider>
              {children}

              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
