'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Label } from '@/src/components/ui/label';
import { Sparkles, ArrowUpRight, CheckCircle2, Globe, Loader2 } from 'lucide-react';
import type { PaletteConfig, FontConfig } from '@/src/providers/custom-theme-provider';

interface LiveThemePreviewProps {
  currentPalette: PaletteConfig;
  currentFont: FontConfig;
  isFullySynced: boolean;
  isPublishing: boolean;
  onApplyGlobally: () => void;
}

export const LiveThemePreview: React.FC<LiveThemePreviewProps> = ({
  currentPalette,
  currentFont,
  isFullySynced,
  isPublishing,
  onApplyGlobally,
}) => {
  return (
    <Card className="relative overflow-hidden border-border/80 bg-card/80 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-[#0A1124]/95 shadow-xl">
      {/* Ambient Palette Glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl opacity-40 transition-colors duration-500"
        style={{ background: currentPalette.primaryColor }}
      />

      <CardHeader className="pb-3 border-b border-border/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider">
              Live UI Preview
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            {currentPalette.name} • {currentFont.name}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        {/* Preview Hero Mock */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4.5 dark:border-slate-800/60 dark:bg-slate-950/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
              <Sparkles className="h-2.5 w-2.5" /> Full Stack Developer
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            Crafting Digital <span className="text-primary">Experiences</span>
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            The quick brown fox jumps over the lazy dog. Experience modern software engineering with
            tailored palettes and typography.
          </p>

          {/* Buttons showcase */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button size="sm" className="gap-1.5 shadow-sm">
              Primary Action <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="outline" className="border-border">
              Secondary Link
            </Button>
          </div>
        </div>

        {/* Progress & Highlights Mock */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Accents & Progress Meter
          </Label>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-foreground font-medium">Performance Score</span>
              <span className="text-primary font-bold">98.4%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: '85%' }}
              />
            </div>
          </div>

          {/* Tech Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Next.js 16', 'TypeScript', 'TailwindCSS', 'Mongoose'].map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-[11px] font-medium border border-border/40 hover:border-primary/40 transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Information Status box */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>
            {isFullySynced ? (
              <>
                This palette, font, and theme mode are stored in the database and served to every
                visitor on their first paint — homepage, hero section, project cards, blog reader,
                and dashboard tables.
              </>
            ) : (
              <>
                You are previewing changes locally. Click{' '}
                <span className="font-semibold text-foreground">Apply Globally</span> to store them
                in the database and serve them to every visitor.
              </>
            )}
          </span>
        </div>

        <Button
          onClick={onApplyGlobally}
          disabled={isPublishing || isFullySynced}
          className="w-full gap-2 cursor-pointer"
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span>
            {isPublishing
              ? 'Publishing…'
              : isFullySynced
                ? 'Already Live Globally'
                : 'Apply Globally'}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default LiveThemePreview;
