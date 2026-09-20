'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ThemeModeSelectorProps {
  activeMode: string;
  onSelectMode: (mode: string) => void;
}

const THEME_MODES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Laptop },
];

export const ThemeModeSelector: React.FC<ThemeModeSelectorProps> = ({
  activeMode,
  onSelectMode,
}) => {
  return (
    <Card className="border-border/80 bg-card/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0A1124]/90 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Sun className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Theme Mode</CardTitle>
            <CardDescription className="text-xs">
              Choose between light, dark, or system appearance
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {THEME_MODES.map(({ id, label, icon: Icon }) => {
            const isSelected = activeMode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onSelectMode(id);
                  toast.success(`Theme mode set to ${label}`);
                }}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-sm shadow-primary/15 text-primary'
                    : 'border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground dark:border-slate-800 dark:bg-slate-950/40'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-semibold">{label}</span>
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeModeSelector;
