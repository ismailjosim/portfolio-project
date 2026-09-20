'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { useCustomTheme, PALETTES, FONTS } from '@/src/providers/custom-theme-provider';
import { normalizeThemeSettings, toThemeMode } from '@/src/lib/theme-options';
import { toast } from 'sonner';

import SettingsHeaderBanner from './SettingsHeaderBanner';
import ThemeModeSelector from './ThemeModeSelector';
import PaletteSelector from './PaletteSelector';
import FontSelector from './FontSelector';
import LiveThemePreview from './LiveThemePreview';

export default function SettingsClientView() {
  const { theme, setTheme } = useTheme();
  const {
    palette,
    setPalette,
    font,
    setFont,
    resetTheme,
    globalSettings,
    isSyncedWithGlobal,
    syncGlobalSettings,
  } = useCustomTheme();
  const [isPublishing, setIsPublishing] = useState(false);

  // `theme` is undefined until next-themes mounts — fall back to the global mode.
  const activeMode = toThemeMode(theme, globalSettings.themeMode);
  const isModeSyncedWithGlobal = activeMode === globalSettings.themeMode;
  const isFullySynced = isSyncedWithGlobal && isModeSyncedWithGlobal;

  const currentPaletteObj = PALETTES.find((p) => p.id === palette) || PALETTES[0];
  const currentFontObj = FONTS.find((f) => f.id === font) || FONTS[0];
  const globalPaletteObj = PALETTES.find((p) => p.id === globalSettings.palette) || PALETTES[0];
  const globalFontObj = FONTS.find((f) => f.id === globalSettings.font) || FONTS[0];

  const handleReset = () => {
    resetTheme();
    setTheme('system');
    toast.success('Theme & typography reset to defaults');
  };

  /** Publishes the current selection to MongoDB so every visitor sees it. */
  const handleApplyGlobally = async () => {
    setIsPublishing(true);

    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ palette, font, themeMode: activeMode }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to save the global theme.');
      }

      syncGlobalSettings(normalizeThemeSettings(json.data));

      toast.success('Global theme published', {
        description: `Every visitor now loads ${currentPaletteObj.name} · ${currentFontObj.name} · ${activeMode} mode.`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save the global theme.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <SettingsHeaderBanner
        isFullySynced={isFullySynced}
        isPublishing={isPublishing}
        globalSettings={globalSettings}
        globalPalette={globalPaletteObj}
        globalFont={globalFontObj}
        onApplyGlobally={handleApplyGlobally}
        onReset={handleReset}
      />

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* ── LEFT COLUMN: Controls ── */}
        <div className="space-y-8 lg:col-span-7">
          <ThemeModeSelector activeMode={activeMode} onSelectMode={setTheme} />
          <PaletteSelector palette={palette} onSelectPalette={setPalette} />
          <FontSelector font={font} onSelectFont={setFont} />
        </div>

        {/* ── RIGHT COLUMN: Live Interactive Playground ── */}
        <div className="lg:col-span-5 sticky top-6 space-y-6">
          <LiveThemePreview
            currentPalette={currentPaletteObj}
            currentFont={currentFontObj}
            isFullySynced={isFullySynced}
            isPublishing={isPublishing}
            onApplyGlobally={handleApplyGlobally}
          />
        </div>
      </div>
    </div>
  );
}
