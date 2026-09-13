import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import WorkingAreasSection from '../components/sections/WorkingAreasSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import EducationSection from '../components/sections/EducationSection';
import BlogSection from '../components/sections/BlogSection';
import GitHubSection from '../components/sections/GitHubSection';
import ContactSection from '../components/sections/ContactSection';
import ScrollToTop from '../components/ui/ScrollToTop';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { PersonJsonLd, WebsiteJsonLd } from '../components/seo/JsonLd';

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
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <TestimonialsSection />
        <BlogSection />
        <GitHubSection />
        <EducationSection />
        <WorkingAreasSection />
        <ContactSection />
      </main>
      <ScrollToTop />
      <Footer />
    </>
  );
}
