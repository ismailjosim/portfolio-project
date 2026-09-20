'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Sliders, CheckCircle2, Sparkles, Globe, RotateCcw, Loader2 } from 'lucide-react';
import type { PaletteConfig, FontConfig, GlobalThemeSettings } from '@/src/providers/custom-theme-provider';

interface SettingsHeaderBannerProps {
  isFullySynced: boolean;
  isPublishing: boolean;
  globalSettings: GlobalThemeSettings;
  globalPalette: PaletteConfig;
  globalFont: FontConfig;
  onApplyGlobally: () => void;
  onReset: () => void;
}

export const SettingsHeaderBanner: React.FC<SettingsHeaderBannerProps> = ({
  isFullySynced,
  isPublishing,
  globalSettings,
  globalPalette,
  globalFont,
  onApplyGlobally,
  onReset,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-r from-card/90 via-primary/5 to-card/90 backdrop-blur-2xl p-6 sm:p-8 shadow-xl dark:border-slate-800/80 dark:bg-[#0A1124]/90">
      {/* Glow background */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              <Sliders className="h-3 w-3" />
              Customization Studio
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">Global Styling Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Theme & Typography Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Customize your portfolio’s visual brand, color palette, and body typography in real
            time. Changes preview instantly here — click{' '}
            <span className="font-semibold text-foreground">Apply Globally</span> to publish them
            to every visitor.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                isFullySynced
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
              }`}
            >
              {isFullySynced ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              {isFullySynced ? 'Live globally' : 'Unpublished preview'}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Global: {globalPalette.name} · {globalFont.name} · {globalSettings.themeMode} mode
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onApplyGlobally}
            disabled={isPublishing || isFullySynced}
            className="gap-2 shadow-sm shadow-primary/20 cursor-pointer"
          >
            {isPublishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Globe className="h-3.5 w-3.5" />
            )}
            <span>{isPublishing ? 'Publishing…' : 'Apply Globally'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isPublishing}
            className="gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeaderBanner;
