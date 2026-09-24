import type { Metadata } from 'next';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import WorkingAreasSection from '../components/sections/WorkingAreasSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import EducationSection from '../components/sections/EducationSection';
import BlogSection from '../components/sections/BlogSection';
import NewsletterSection from '../components/sections/NewsletterSection';
import GitHubSection from '../components/sections/GitHubSection';
import ContactSection from '../components/sections/ContactSection';
import ScrollToTop from '../components/ui/ScrollToTop';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { PersonJsonLd, WebsiteJsonLd } from '../components/seo/JsonLd';
import { siteConfig } from '../constants/site-config';

export const metadata: Metadata = {
  title: `${siteConfig.name} — Full-Stack Developer & Software Engineer`,
  description: siteConfig.bio,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteConfig.name} — Full-Stack Developer & Software Engineer`,
    description: siteConfig.bio,
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Full-Stack Developer & Software Engineer`,
    description: siteConfig.bio,
    images: ['/opengraph-image'],
  },
};

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <WebsiteJsonLd />
      <header>
        <Navbar />
      </header>
      <main className="homepage-sections min-h-screen transition-all duration-300">
        <HeroSection />
        <AboutSection />
        <WorkingAreasSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <GitHubSection />
        <TestimonialsSection />
        <BlogSection />
        <NewsletterSection />
        <ContactSection />
      </main>
      <ScrollToTop />
      <Footer />
    </>
  );
}
