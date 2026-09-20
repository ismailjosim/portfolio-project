'use client';

import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import SkillIcon from '@/src/components/shared/SkillIcon';

interface TechIconPickerTriggerProps {
  value: string;
  displayLabel: string;
  isUrl: boolean;
  onClear: () => void;
}

export const TechIconPickerTrigger = React.forwardRef<
  HTMLButtonElement,
  TechIconPickerTriggerProps
>(({ value, displayLabel, isUrl, onClear, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className="w-full justify-between gap-2 h-10 px-3 bg-background border-input font-normal hover:bg-muted/40 cursor-pointer min-w-0"
      {...props}
    >
      <div className="flex items-center gap-2.5 truncate min-w-0">
        {value ? (
          <>
            <div className="w-6 h-6 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/60 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-2xs">
              <SkillIcon
                icon={value}
                size={18}
                className="text-base shrink-0 object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 truncate min-w-0">
              <span className="truncate text-xs font-medium text-foreground">
                {displayLabel}
              </span>
              {isUrl && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-primary/10 text-primary border border-primary/20 shrink-0">
                  Custom
                </span>
              )}
            </div>
          </>
        ) : (
          <span className="text-muted-foreground text-xs">Select skill icon…</span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {value && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-1 text-muted-foreground hover:text-destructive rounded-full cursor-pointer transition-colors"
            title="Clear icon"
          >
            <X size={12} />
          </span>
        )}
        <ChevronDown size={14} className="text-muted-foreground opacity-60" />
      </div>
    </Button>
  );
});

TechIconPickerTrigger.displayName = 'TechIconPickerTrigger';

export default TechIconPickerTrigger;
