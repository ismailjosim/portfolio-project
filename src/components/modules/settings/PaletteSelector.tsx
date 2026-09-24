'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Palette, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  PALETTES,
  type PaletteConfig,
  type PaletteId,
} from '@/src/providers/custom-theme-provider';

interface PaletteSelectorProps {
  palette: PaletteId;
  onSelectPalette: (paletteId: PaletteId) => void;
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({ palette, onSelectPalette }) => {
  return (
    <Card className="border-border/80 bg-card/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0A1124]/90 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Palette className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Color Palette</CardTitle>
            <CardDescription className="text-xs">
              Select a curated color scheme for accents, buttons, and glowing gradients
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PALETTES.map((p: PaletteConfig) => {
            const isSelected = palette === p.id;

            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPalette(p.id);
                  toast.success(`Applied ${p.name} palette`);
                }}
                className={`group relative flex items-start gap-3.5 rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20 ring-1 ring-primary'
                    : 'border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40 dark:border-slate-800 dark:bg-slate-950/30'
                }`}
              >
                {/* Swatch Circle */}
                <div
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md border border-white/20"
                  style={{
                    background: `linear-gradient(135deg, ${p.primaryColor}, ${p.accentColor})`,
                  }}
                >
                  {isSelected && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-xs text-foreground truncate">{p.name}</h4>
                    {p.id === 'cyan' && (
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaletteSelector;
