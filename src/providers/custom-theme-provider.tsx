'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  DEFAULT_FONT,
  DEFAULT_PALETTE,
  DEFAULT_THEME_MODE,
  GlobalThemeSettings,
  normalizeThemeSettings,
  type FontId,
  type PaletteId,
  type ThemeMode,
} from '@/src/lib/theme-options';

export type {
  FontId,
  PaletteId,
  ThemeMode,
  GlobalThemeSettings,
  GlobalThemeSettings as ThemeSettings,
};

export {
  PALETTES,
  FONTS,
  type PaletteOption,
  type FontOption,
  type PaletteConfig,
  type FontConfig,
} from '@/src/lib/theme-presets';

interface CustomThemeContextType {
  /** Palette currently rendered in this browser (global value, or an unpublished preview). */
  palette: PaletteId;
  setPalette: (palette: PaletteId) => void;
  /** Font currently rendered in this browser (global value, or an unpublished preview). */
  font: FontId;
  setFont: (font: FontId) => void;
  resetTheme: () => void;
  /** Last known settings published by the admin (source of truth: MongoDB). */
  globalSettings: GlobalThemeSettings;
  /** True when the current selection still matches the published global theme. */
  isSyncedWithGlobal: boolean;
  /** Adopts a freshly published payload as the new global baseline. */
  syncGlobalSettings: (settings: GlobalThemeSettings) => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

/**
 * Epoch ms of the newest global publish this browser already applied. The only
 * value still kept in localStorage — palette and font now come from MongoDB, this
 * marker exists so a new publish can also override the theme mode that
 * `next-themes` persists per browser.
 */
const GLOBAL_SYNC_STORAGE_KEY = 'portfolio_theme_global_sync';

const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`Failed to persist ${key} to localStorage:`, e);
  }
};

const applyDocumentTheme = (palette: PaletteId, font: FontId) => {
  document.documentElement.setAttribute('data-palette', palette);
  document.documentElement.setAttribute('data-font', font);
};

export interface CustomThemeProviderProps {
  children: React.ReactNode;
  /** Global palette resolved on the server, used for the first paint (no FOUC). */
  initialPalette?: PaletteId;
  /** Global font resolved on the server, used for the first paint (no FOUC). */
  initialFont?: FontId;
  initialThemeMode?: ThemeMode;
  /** Epoch ms of the global publish that produced the props above. */
  initialUpdatedAt?: number;
}

export function CustomThemeProvider({
  children,
  initialPalette = DEFAULT_PALETTE,
  initialFont = DEFAULT_FONT,
  initialThemeMode = DEFAULT_THEME_MODE,
  initialUpdatedAt = 0,
}: CustomThemeProviderProps) {
  const { setTheme } = useTheme();

  const [palette, setPaletteState] = useState<PaletteId>(initialPalette);
  const [font, setFontState] = useState<FontId>(initialFont);
  const [globalSettings, setGlobalSettings] = useState<GlobalThemeSettings>({
    palette: initialPalette,
    font: initialFont,
    themeMode: initialThemeMode,
    updatedAt: initialUpdatedAt,
  });

  /** Set once the admin tweaks the theme in this tab, so a late sync cannot clobber it. */
  const hasUnpublishedEditsRef = useRef(false);

  useEffect(() => {
    // The server already rendered the global palette/font, so nothing needs to
    // happen before paint. This re-checks the live document afterwards, which
    // matters when the HTML came from a CDN/route cache, and pushes a brand new
    // publish onto returning visitors whose theme mode is persisted by next-themes.
    let cancelled = false;

    const syncWithDatabase = async () => {
      try {
        const res = await fetch('/api/theme', { cache: 'no-store' });
        if (!res.ok) return;

        const json = await res.json();
        if (cancelled || !json?.data) return;

        const settings = normalizeThemeSettings(json.data, {
          palette: initialPalette,
          font: initialFont,
          themeMode: initialThemeMode,
          updatedAt: initialUpdatedAt,
        });

        setGlobalSettings(settings);

        if (!hasUnpublishedEditsRef.current) {
          setPaletteState(settings.palette);
          setFontState(settings.font);
          applyDocumentTheme(settings.palette, settings.font);
        }

        // Only a publish this browser has never applied may override the visitor's
        // own light/dark choice — after that, their toggle wins again.
        const syncedAt = Number(readStorage(GLOBAL_SYNC_STORAGE_KEY)) || 0;
        if (settings.updatedAt > syncedAt) {
          writeStorage(GLOBAL_SYNC_STORAGE_KEY, String(settings.updatedAt));
          setTheme(settings.themeMode);
        }
      } catch (e) {
        // Offline or transient failure — keep the server-rendered theme.
        console.warn('Failed to sync global theme settings:', e);
      }
    };

    void syncWithDatabase();

    return () => {
      cancelled = true;
    };
  }, [setTheme, initialPalette, initialFont, initialThemeMode, initialUpdatedAt]);

  const setPalette = (newPalette: PaletteId) => {
    hasUnpublishedEditsRef.current = true;
    setPaletteState(newPalette);
    applyDocumentTheme(newPalette, font);
  };

  const setFont = (newFont: FontId) => {
    hasUnpublishedEditsRef.current = true;
    setFontState(newFont);
    applyDocumentTheme(palette, newFont);
  };

  const resetTheme = () => {
    hasUnpublishedEditsRef.current = true;
    setPaletteState(DEFAULT_PALETTE);
    setFontState(DEFAULT_FONT);
    applyDocumentTheme(DEFAULT_PALETTE, DEFAULT_FONT);
  };

  const syncGlobalSettings = (settings: GlobalThemeSettings) => {
    hasUnpublishedEditsRef.current = false;
    setGlobalSettings(settings);
    writeStorage(GLOBAL_SYNC_STORAGE_KEY, String(settings.updatedAt));
    setPaletteState(settings.palette);
    setFontState(settings.font);
    applyDocumentTheme(settings.palette, settings.font);
  };

  return (
    <CustomThemeContext.Provider
      value={{
        palette,
        setPalette,
        font,
        setFont,
        resetTheme,
        globalSettings,
        isSyncedWithGlobal: palette === globalSettings.palette && font === globalSettings.font,
        syncGlobalSettings,
      }}
    >
      {children}
    </CustomThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(CustomThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
}
