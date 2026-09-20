'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Type, Check } from 'lucide-react';
import { toast } from 'sonner';
import { FONTS, type FontConfig, type FontId } from '@/src/providers/custom-theme-provider';

interface FontSelectorProps {
  font: FontId;
  onSelectFont: (fontId: FontId) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ font, onSelectFont }) => {
  return (
    <Card className="border-border/80 bg-card/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0A1124]/90 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Type className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Body Typography</CardTitle>
            <CardDescription className="text-xs">
              Choose the primary Google Font applied across public pages & dashboard
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map((f: FontConfig) => {
            const isSelected = font === f.id;

            return (
              <div
                key={f.id}
                onClick={() => {
                  onSelectFont(f.id);
                  toast.success(`Font updated to ${f.name}`);
                }}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20 ring-1 ring-primary'
                    : 'border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40 dark:border-slate-800 dark:bg-slate-950/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-foreground">{f.name}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {f.category}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <p
                  className="text-xs text-muted-foreground line-clamp-2 border-t border-border/40 pt-2 dark:border-slate-800/40"
                  style={{
                    fontFamily:
                      f.id === 'jakarta'
                        ? "'Plus Jakarta Sans', sans-serif"
                        : f.id === 'outfit'
                          ? "'Outfit', sans-serif"
                          : f.id === 'space-grotesk'
                            ? "'Space Grotesk', sans-serif"
                            : f.id === 'poppins'
                              ? "'Poppins', sans-serif"
                              : f.id === 'rajdhani'
                                ? "'Rajdhani', sans-serif"
                                : f.id === 'roboto'
                                  ? "'Roboto', sans-serif"
                                  : "'Inter', sans-serif",
                  }}
                >
                  {f.previewText}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSelector;
