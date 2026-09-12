'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ThemeToggle from '../ui/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About Me', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Technical Skills', href: '#skills' },
  { name: 'Experiences', href: '#experience' },
  { name: 'Blogs', href: '#blog' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === '/';

  const currentActive = !isHomePage
    ? pathname.startsWith('/blogs')
      ? '#blog'
      : pathname.startsWith('/projects') || pathname.startsWith('/all-projects')
        ? '#projects'
        : ''
    : activeSection;

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Check if user scrolled near the bottom of the page
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight - scrollPosition < 120) {
        setActiveSection('#contact');
        return;
      }

      // Check if user is at the very top of the page
      if (window.scrollY < 120) {
        setActiveSection('#home');
        return;
      }

      const sections = navItems.map((item) => item.href.substring(1));
      const focalPoint = 180;
      let current = sections[0];

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalPoint && rect.bottom > focalPoint) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(`#${current}`);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(href);
        window.history.pushState(null, '', href);
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
    </header>
  );
}
