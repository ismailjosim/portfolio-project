'use client';

import React from 'react';
import { Check } from 'lucide-react';
import SkillIcon from '@/src/components/shared/SkillIcon';
import type { PresetSkill } from '@/src/constants/presetSkills';

export const CATEGORY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: '⭐ Custom', value: 'custom' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Languages', value: 'languages' },
  { label: 'Database', value: 'database' },
  { label: 'DevOps & Tools', value: 'tools-devops' },
  { label: 'UI / CSS', value: 'styling-ui' },
] as const;

export const isImageUrl = (str?: string): boolean => {
  if (!str) return false;
  return (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('/') ||
    str.startsWith('data:')
  );
};

interface TechPresetTabProps {
  search: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filteredTechSkills: PresetSkill[];
  selectedValue: string;
  onSelectSkill: (skill: PresetSkill) => void;
  onGoToCustom: () => void;
}

export const TechPresetTab: React.FC<TechPresetTabProps> = ({
  search,
  selectedCategory,
  setSelectedCategory,
  filteredTechSkills,
  selectedValue,
  onSelectSkill,
  onGoToCustom,
}) => {
  return (
    <div className="flex flex-col">
      {/* Quick Category filter chip bar (only when not searching) */}
      {!search && (
        <div className="flex items-center gap-1 overflow-x-auto px-2.5 py-1.5 border-b border-border/60 bg-muted/10 scrollbar-none text-[10px]">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Compact Pills Scroll Container */}
      <div className="p-2.5 max-h-52 overflow-y-auto scrollbar-thin flex flex-wrap gap-1.5">
        {filteredTechSkills.length === 0 ? (
          <div className="w-full py-6 text-center text-xs text-muted-foreground">
            No icon found for &quot;{search}&quot;.
            <button
              type="button"
              onClick={onGoToCustom}
              className="block mx-auto mt-2 text-xs text-primary hover:underline font-medium cursor-pointer"
            >
              + Add custom icon instead
            </button>
          </div>
        ) : (
          filteredTechSkills.map((preset) => {
            const isSelected = selectedValue === preset.icon;
            const isCustom = isImageUrl(preset.icon);

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectSkill(preset)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all duration-100 cursor-pointer select-none ${
                  isSelected
                    ? 'border-primary bg-primary/15 text-primary font-semibold ring-1 ring-primary/30'
                    : isCustom
                      ? 'border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10 text-foreground'
                      : 'border-border/70 bg-card hover:border-foreground/30 hover:bg-muted/60 text-foreground'
                }`}
              >
                <SkillIcon
                  icon={preset.icon}
                  size={14}
                  className="text-sm shrink-0 object-contain"
                />
                <span className="truncate max-w-32">{preset.name}</span>
                {isCustom && (
                  <span className="text-[9px] text-primary/80 font-mono font-semibold">
                    Custom
                  </span>
                )}
                {isSelected && (
                  <Check className="h-2.5 w-2.5 text-primary ml-0.5 shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TechPresetTab;
