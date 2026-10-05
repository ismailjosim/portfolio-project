'use client';

import { useCallback, useState } from 'react';
import { Mail, Layers, Trophy, GithubIcon, Code2, FileCheck, Users, FileText } from 'lucide-react';
import { ReactTyped } from 'react-typed';
import SocialIcons from '../shared/SocialIcons';
import ResumeModal from '../ui/ResumeModal';

const TYPED_TEXTS = [
  'Full Stack Developer',
  'MERN Stack Expert',
  'Senior Web Instructor',
  'Open Source Enthusiast',
];

const STATS = [
  { value: '3+', label: 'Years Experience' },
  { value: '2K+', label: 'Students Taught' },
  { value: '10+', label: 'Fullstack Projects' },
];

const BADGES = [
  {
    icon: Trophy,
    title: '1500+ Hrs',
    subtitle: 'Live Sessions',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconRing: 'ring-1 ring-amber-500/25',
    iconColor: 'text-amber-500 dark:text-amber-400',
    position: '-top-3 -right-2 sm:-top-4 sm:-right-4 [animation-delay:0.3s]',
  },
  {
    icon: Users,
    title: 'Senior',
    subtitle: 'Web Instructor',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    iconRing: 'ring-1 ring-rose-500/25',
    iconColor: 'text-rose-500 dark:text-rose-400',
    position: '-top-3 left-4 sm:-top-4 sm:left-6 [animation-delay:1.2s]',
  },
  {
    icon: Code2,
    title: '11K+',
    subtitle: 'Problems Solved',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    iconRing: 'ring-1 ring-cyan-500/25',
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    position: 'top-1/3 -left-4 sm:-left-6 lg:-left-4 xl:-left-6 [animation-delay:0.7s]',
  },
  {
    icon: GithubIcon,
    title: '135+',
    subtitle: 'Github Repos',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconRing: 'ring-1 ring-emerald-500/25',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    position: 'bottom-8 -left-2 sm:bottom-10 sm:-left-3 lg:-left-3 xl:-left-4 [animation-delay:1.5s]',
  },
  {
    icon: FileCheck,
    title: '8.9K+',
    subtitle: 'Projects Reviewed',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    iconRing: 'ring-1 ring-purple-500/25',
    iconColor: 'text-purple-500 dark:text-purple-400',
    position: '-bottom-2 -right-2 sm:-bottom-3 sm:-right-3 [animation-delay:1s]',
  },
];

export default function HeroSection() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <>
      <ResumeModal open={isResumeOpen} onOpenChange={setIsResumeOpen} />

      <section
        id="home"
        className="relative overflow-hidden min-h-screen flex items-center px-4 sm:px-6 md:px-12 lg:px-16 pt-28 sm:pt-32 lg:pt-16 pb-12 lg:pb-10 scroll-mt-24 bg-linear-to-br from-background to-secondary/40"
      >
        {/* Background Blobs */}
        <div className="absolute -top-24 -right-16 w-100 h-100 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-20 w-70 h-70 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto flex flex-col-reverse lg:grid lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 xl:col-span-7 z-10">
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-foreground mb-3 sm:mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>Available for Remote Roles & Consulting</span>
              <span className="text-muted-foreground hidden sm:inline">• Dhaka (GMT+6)</span>
            </div>

            <p className="uppercase tracking-widest text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">
              👋 Hello, I&apos;m
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-foreground leading-tight mb-2 sm:mb-3">
              Md. Jasim
            </h1>

            <div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-muted-foreground mb-4 sm:mb-6 min-h-8">
              <ReactTyped
                strings={TYPED_TEXTS}
                typeSpeed={50}
                backSpeed={50}
                startDelay={1200}
                backDelay={1500}
                loop
                className="text-primary"
                cursorChar="🚀"
              />
            </div>

            <p className="text-muted-foreground text-sm sm:text-base xl:text-lg max-w-xl leading-relaxed mb-6 sm:mb-8">
              Full Stack Developer & Senior Web Instructor at{' '}
              <a
                href="https://web.programming-hero.com/home"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Programming Hero
              </a>
              <br />I build scalable web apps with React, Node.js, and MongoDB — and help 2000+
              students do the same.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
              <a
                href="mailto:ismailjosim@yahoo.com"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
              >
                <Mail size={16} />
                Hire Me
              </a>

              <button
                onClick={() => setIsResumeOpen(true)}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold transition-transform hover:scale-105 active:scale-95 cursor-pointer hover:border-primary/40"
              >
                <FileText size={16} className="text-primary" />
                View Resume
              </button>

              <button
                onClick={() => scrollToSection('projects')}
                className="flex items-center gap-2 border border-primary text-primary px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold transition-all hover:bg-primary hover:text-white active:scale-95 cursor-pointer"
              >
                <Layers size={16} />
                View Projects
              </button>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-4 sm:gap-5 mb-8 lg:mb-8 xl:mb-12">
              <SocialIcons.Github />
              <SocialIcons.Linkedin />
              <SocialIcons.Facebook />
              <SocialIcons.Twitter />
              <SocialIcons.Youtube />
              <SocialIcons.Email />
            </div>

            {/* STATS */}
            <div className="flex flex-wrap sm:justify-start justify-center items-center gap-8 lg:gap-6 xl:gap-8">
              {STATS.map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-6 xl:gap-8">
                  {index > 0 && <div className="hidden sm:block w-px h-10 bg-border" />}
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-center justify-center w-full">
            <div className="relative">
              {/* Profile Image with Proportional Sizing across Viewports */}
              <div
                className="hero-morph w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-95 lg:h-95 xl:w-115 xl:h-115 2xl:w-125 2xl:h-125 bg-center bg-cover"
                style={{ backgroundImage: "url('/person.jpeg')" }}
                role="img"
                aria-label="Md. Jasim profile image"
              />

              {/* Glow */}
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10" />

              {/* Floating Badges for Tablet & Desktop */}
              <div className="sm:block hidden">
                {BADGES.map((badge, i) => {
                  const Icon = badge.icon;

                  return (
                    <div
                      key={i}
                      className={`absolute ${badge.position} group bg-background/85 dark:bg-card/85 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-md hover:shadow-xl hover:border-primary/40 rounded-full px-2.5 py-1.5 flex items-center gap-2 float-y z-20 transition-all duration-300 hover:scale-105 cursor-default`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${badge.iconBg} ${badge.iconRing} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
                      >
                        <Icon size={12} className={badge.iconColor} />
                      </div>
                      <div className="flex items-center gap-1.5 pr-1 whitespace-nowrap">
                        <span className="font-extrabold text-xs text-foreground tracking-tight">
                          {badge.title}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">
                          {badge.subtitle}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Swipeable Achievement Badges */}
            <div className="sm:hidden flex overflow-x-auto gap-2 py-3 mt-6 w-full max-w-sm scrollbar-none snap-x px-1">
              {BADGES.map((badge, i) => {
                const Icon = badge.icon;

                return (
                  <div
                    key={i}
                    className="shrink-0 snap-start bg-background/85 dark:bg-card/85 backdrop-blur-md border border-border/80 dark:border-white/10 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    <div
                      className={`w-5 h-5 ${badge.iconBg} ${badge.iconRing} rounded-full flex items-center justify-center shrink-0`}
                    >
                      <Icon size={11} className={badge.iconColor} />
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap pr-0.5">
                      <span className="font-bold text-xs text-foreground">
                        {badge.title}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {badge.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
