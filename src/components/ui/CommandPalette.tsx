'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/src/components/ui/dialog';
import {
  Search,
  FolderGit2,
  FileText,
  User,
  Wrench,
  Briefcase,
  Mail,
  Sun,
  Moon,
  Copy,
  ExternalLink,
  Palette,
  Check,
  Award,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { PALETTES, useCustomTheme } from '@/src/providers/custom-theme-provider';
import { siteConfig } from '@/src/constants/site-config';
import { toast } from 'sonner';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenResume?: () => void;
}

export default function CommandPalette({ open, onOpenChange, onOpenResume }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { palette: currentPalette, setPalette } = useCustomTheme();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleNavigate = (target: string) => {
    onOpenChange(false);
    if (target.startsWith('#')) {
      if (pathname !== '/') {
        router.push(`/${target}`);
      } else {
        const el = document.getElementById(target.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      router.push(target);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      toast.success('Email copied to clipboard!');
      onOpenChange(false);
    } catch {
      toast.error('Failed to copy email');
    }
  };

  const navCommands = [
    { label: 'Home', icon: User, action: () => handleNavigate('#home'), group: 'Navigation' },
    { label: 'About Me', icon: User, action: () => handleNavigate('#about'), group: 'Navigation' },
    {
      label: 'Featured Projects',
      icon: FolderGit2,
      action: () => handleNavigate('#projects'),
      group: 'Navigation',
    },
    {
      label: 'All Projects (Full Catalog)',
      icon: FolderGit2,
      action: () => handleNavigate('/all-projects'),
      group: 'Navigation',
    },
    {
      label: 'Technical Skills',
      icon: Wrench,
      action: () => handleNavigate('#skills'),
      group: 'Navigation',
    },
    {
      label: 'Work Experience',
      icon: Briefcase,
      action: () => handleNavigate('#experience'),
      group: 'Navigation',
    },
    {
      label: 'Instructor Excellence & Milestones',
      icon: Award,
      action: () => handleNavigate('#impact'),
      group: 'Navigation',
    },
    {
      label: 'Engineering Blog',
      icon: FileText,
      action: () => handleNavigate('/blogs'),
      group: 'Navigation',
    },
    {
      label: 'Contact Form',
      icon: Mail,
      action: () => handleNavigate('#contact'),
      group: 'Navigation',
    },
  ];

  const actionCommands = [
    {
      label: 'View / Print Resume (CV)',
      icon: FileText,
      action: () => {
        onOpenChange(false);
        if (onOpenResume) onOpenResume();
      },
      group: 'Actions',
    },
    {
      label: `Copy Email (${siteConfig.email})`,
      icon: Copy,
      action: handleCopyEmail,
      group: 'Actions',
    },
    {
      label: 'Toggle Theme (Light / Dark)',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        onOpenChange(false);
      },
      group: 'Actions',
    },
    {
      label: 'Open GitHub Profile',
      icon: ExternalLink,
      action: () => {
        window.open(siteConfig.socials.github, '_blank');
        onOpenChange(false);
      },
      group: 'Actions',
    },
    {
      label: 'Open LinkedIn Profile',
      icon: ExternalLink,
      action: () => {
        window.open(siteConfig.socials.linkedin, '_blank');
        onOpenChange(false);
      },
      group: 'Actions',
    },
  ];

  const paletteCommands = PALETTES.map((p) => ({
    label: `Theme Palette: ${p.name}`,
    color: p.primaryColor,
    active: currentPalette === p.id,
    action: () => {
      setPalette(p.id);
      onOpenChange(false);
    },
    group: 'Color Themes',
  }));

  const allCommands = [...navCommands, ...actionCommands];
  const filteredNav = allCommands.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPalettes = paletteCommands.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        {/* Search header */}
        <div className="flex items-center px-4 border-b border-border/70">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, section name, or theme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-4 bg-transparent text-sm md:text-base outline-none text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-mono text-muted-foreground bg-muted rounded border border-border">
            ESC
          </kbd>
        </div>

        {/* List of results */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4 text-sm">
          {filteredNav.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Commands & Navigation
              </p>
              <div className="space-y-0.5">
                {filteredNav.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.label}
                      onClick={cmd.action}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-accent/15 hover:text-accent transition-colors text-left text-foreground cursor-pointer group"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        <span>{cmd.label}</span>
                      </span>
                      <span className="text-xs text-muted-foreground group-hover:text-accent">
                        Jump →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredPalettes.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Color Palettes
              </p>
              <div className="space-y-0.5">
                {filteredPalettes.map((pal) => (
                  <button
                    key={pal.label}
                    onClick={pal.action}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-accent/15 transition-colors text-left text-foreground cursor-pointer group"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: pal.color }}
                      />
                      <span>{pal.label}</span>
                    </span>
                    {pal.active && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredPalettes.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No matching commands or actions found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Tip: Press{' '}
            <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px] font-mono">
              ⌘K
            </kbd>{' '}
            anywhere to open
          </span>
          <span className="flex items-center gap-1">
            <Palette className="w-3 h-3 text-primary" /> Multi-Palette Theme
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
