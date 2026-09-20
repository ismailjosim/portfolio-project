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
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    position: 'sm:-top-6 -top-10 sm:-right-8 -right-4 lg:-top-4 lg:-right-10',
  },
  {
    icon: GithubIcon,
    title: '135+',
    subtitle: 'Github Repos',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    position: 'lg:bottom-12 bottom-2 lg:-left-12 -left-6 [animation-delay:1.5s]',
  },
  {
    icon: Code2,
    title: '11K+',
    subtitle: 'Problems Solved',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    position: 'top-1/3 -left-12 lg:-left-16 [animation-delay:0.7s]',
  },
  {
    icon: FileCheck,
    title: '8.9K+',
    subtitle: 'Projects Reviewed',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-500',
    position: 'bottom-0 -right-10 lg:-bottom-4 lg:-right-10 [animation-delay:1s]',
  },
  {
    icon: Users,
    title: 'Senior',
    subtitle: 'Web Instructor',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
    position: 'top-0 -left-4 lg:-top-6 lg:left-12 [animation-delay:1.2s]',
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
        className="relative overflow-hidden min-h-screen flex items-center px-6 md:px-16 pt-32 lg:pt-10 scroll-mt-24 bg-linear-to-br from-background to-secondary/40"
      >
        {/* Background Blobs */}
        <div className="absolute -top-24 -right-16 w-100 h-100 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-70 h-70 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-foreground mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>Available for Remote Roles & Consulting</span>
              <span className="text-muted-foreground hidden sm:inline">• Dhaka (GMT+6)</span>
            </div>

            <p className="uppercase tracking-widest text-sm font-semibold text-primary mb-2">
              👋 Hello, I&apos;m
            </p>

            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-3">
              Md. Jasim
            </h1>

            <div className="flex items-center gap-2 text-2xl font-semibold text-muted-foreground mb-6 min-h-8">
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

            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed mb-8">
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
            <div className="flex flex-wrap gap-4 mb-6">
              <a
                href="mailto:ismailjosim@yahoo.com"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-semibold transition-transform hover:scale-105 active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
              >
                <Mail size={16} />
                Hire Me
              </a>

              <button
                onClick={() => setIsResumeOpen(true)}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-6 py-3 rounded-2xl font-semibold transition-transform hover:scale-105 active:scale-95 cursor-pointer hover:border-primary/40"
              >
                <FileText size={16} className="text-primary" />
                View Resume
              </button>

              <button
                onClick={() => scrollToSection('projects')}
                className="flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-2xl font-semibold transition-all hover:bg-primary hover:text-white active:scale-95 cursor-pointer"
              >
                <Layers size={16} />
                View Projects
              </button>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-5 mb-12">
              <SocialIcons.Github />
              <SocialIcons.Linkedin />
              <SocialIcons.Facebook />
              <SocialIcons.Twitter />
              <SocialIcons.Youtube />
              <SocialIcons.Email />
            </div>

            {/* STATS */}
            <div className="flex flex-wrap sm:justify-start justify-center items-center gap-12 lg:gap-8">
              {STATS.map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-8">
                  {index > 0 && <div className="hidden sm:block w-px h-10 bg-border" />}
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col items-center lg:items-end justify-center w-full">
            <div className="relative">
              {/* Profile Image */}
              <div
                className="hero-morph w-80 h-80 md:w-110 md:h-110 lg:w-150 lg:h-150 bg-center bg-cover"
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
                      className={`absolute ${badge.position} bg-card shadow-xl rounded-2xl p-4 flex items-center gap-3 float-y`}
                    >
                      <div
                        className={`w-10 h-10 ${badge.iconBg} rounded-2xl flex items-center justify-center shrink-0`}
                      >
                        <Icon size={18} className={badge.iconColor} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground whitespace-nowrap">
                          {badge.title}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {badge.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Swipeable Achievement Badges */}
            <div className="sm:hidden flex overflow-x-auto gap-2.5 py-4 mt-6 w-full max-w-sm scrollbar-none snap-x px-1">
              {BADGES.map((badge, i) => {
                const Icon = badge.icon;

                return (
                  <div
                    key={i}
                    className="shrink-0 snap-start bg-card/90 backdrop-blur-md border border-border/80 shadow-md rounded-2xl p-3 flex items-center gap-2.5 active:scale-95 transition-transform"
                  >
                    <div
                      className={`w-8 h-8 ${badge.iconBg} rounded-xl flex items-center justify-center shrink-0`}
                    >
                      <Icon size={16} className={badge.iconColor} />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-foreground whitespace-nowrap">
                        {badge.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {badge.subtitle}
                      </div>
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
