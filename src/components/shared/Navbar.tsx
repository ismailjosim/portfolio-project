'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ThemeToggle from '../ui/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import CommandPalette from '../ui/CommandPalette';
import ResumeModal from '../ui/ResumeModal';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About Me', href: '#about' },
  { name: 'Technical Skills', href: '#skills' },
  { name: 'Experiences', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Projects', href: '#projects' },
  { name: 'Blogs', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const isHomePage = pathname === '/';
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentActive = !isHomePage
    ? pathname.startsWith('/blogs')
      ? '#blog'
      : pathname.startsWith('/projects') || pathname.startsWith('/all-projects')
        ? '#projects'
        : ''
    : activeSection;

  useEffect(() => {
    if (!isHomePage) return;

    // Handle initial hash in URL on page load
    let initialTimer: NodeJS.Timeout | null = null;
    if (window.location.hash) {
      const hash = window.location.hash;
      const targetEl = document.getElementById(hash.substring(1));
      if (targetEl) {
        initialTimer = setTimeout(() => {
          setActiveSection(hash);
          const navHeight = 90;
          const elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: hash === '#home' ? 0 : Math.max(0, elementTop - navHeight),
            behavior: 'smooth',
          });
        }, 150);
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // When smooth scroll was triggered by clicking a nav link, don't override activeSection
      if (isClickScrollingRef.current) return;

      // 1. Very top of page
      if (window.scrollY < 120) {
        setActiveSection('#home');
        return;
      }

      // 2. Near bottom of page
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight - scrollPosition < 220) {
        setActiveSection('#contact');
        return;
      }

      // 3. Section proximity probe: determine current section by probing below the fixed navbar
      const probeY = window.scrollY + 140;
      let matched = 'home';

      for (const item of navItems) {
        const id = item.href.substring(1);
        const el = document.getElementById(id);
        if (el) {
          const elementTop = el.getBoundingClientRect().top + window.scrollY;
          if (probeY >= elementTop) {
            matched = id;
          }
        }
      }

      setActiveSection(`#${matched}`);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (initialTimer) clearTimeout(initialTimer);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isHomePage]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    onComplete?: () => void
  ) => {
    if (isHomePage && href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      const el = document.getElementById(id);
      if (el) {
        isClickScrollingRef.current = true;
        setActiveSection(href);
        window.history.pushState(null, '', href);

        const navHeight = 90;
        const elementTop = el.getBoundingClientRect().top + window.scrollY;
        const targetPosition = id === 'home' ? 0 : Math.max(0, elementTop - navHeight);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 850);
      }
    }
    if (onComplete) {
      onComplete();
    }
  };

  const getItemHref = (href: string) => {
    return isHomePage ? href : `/${href}`;
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav
        className={cn(
          'pointer-events-auto lg:w-fit w-[90%] md:container mx-auto flex items-center lg:justify-center justify-between gap-5 pr-2 rounded-2xl border transition-all duration-300 p-1',
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-border shadow-sm'
            : 'bg-background/50 backdrop-blur-sm border-transparent'
        )}
      >
        {/* ── Logo + availability badge ── */}
        <div className="flex flex-col justify-center border border-primary rounded-full">
          <Link href="/" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <Avatar className="w-12 h-12">
              <AvatarImage className="object-contain" src="/sticker.png" />
              <AvatarFallback>J.</AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* ── Desktop nav links (hidden below lg because 8 items need space) ── */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={getItemHref(item.href)}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                  currentActive === item.href
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border/70 bg-background/60 hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
            aria-label="Open command palette"
            title="Command Menu (Cmd+K)"
          >
            <Search size={13} className="text-primary" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border border-border">
              ⌘K
            </kbd>
          </button>

          {/* Quick CV Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsResumeOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded-xl text-xs h-8 border-primary/40 hover:bg-primary/10 hover:text-primary cursor-pointer"
          >
            <FileText size={13} className="text-primary" />
            Resume
          </Button>

          <ThemeToggle />

          {/* Mobile / tablet menu — visible below lg */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-2xl text-muted-foreground hover:text-accent hover:bg-muted transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </SheetTrigger>

            <SheetContent side="top" className="pt-16 rounded-b-3xl border-border bg-background">
              <div className="flex items-center gap-2 pb-4 mb-3 border-b border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCommandOpen(true);
                  }}
                  className="w-full gap-2 text-xs rounded-xl"
                >
                  <Search size={14} className="text-primary" />
                  Commands (⌘K)
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsResumeOpen(true);
                  }}
                  className="w-full gap-2 text-xs rounded-xl bg-primary text-primary-foreground"
                >
                  <FileText size={14} />
                  Resume
                </Button>
              </div>

              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={getItemHref(item.href)}
                      onClick={(e) =>
                        handleNavClick(e, item.href, () => setIsMobileMenuOpen(false))
                      }
                      className={cn(
                        'block px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer',
                        currentActive === item.href
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Global Command Palette & Resume Modals */}
      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        onOpenResume={() => setIsResumeOpen(true)}
      />
      <ResumeModal open={isResumeOpen} onOpenChange={setIsResumeOpen} />
    </header>
  );
}
