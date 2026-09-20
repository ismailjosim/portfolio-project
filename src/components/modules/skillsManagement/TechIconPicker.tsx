'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, Shapes, PlusCircle } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Input } from '../../ui/input';
import { PRESET_SKILLS, PresetSkill } from '@/src/constants/presetSkills';
import { SkillCategoryDTO } from '@/src/types/skill.interface';

import TechPresetTab, { isImageUrl } from './iconPicker/TechPresetTab';
import LucideIconsTab, { LUCIDE_FALLBACK_ICONS } from './iconPicker/LucideIconsTab';
import CustomIconTab, { CustomIconItem } from './iconPicker/CustomIconTab';
import TechIconPickerTrigger from './iconPicker/TechIconPickerTrigger';

export type { CustomIconItem };

interface TechIconPickerProps {
  value: string;
  onChange: (icon: string, skillName?: string, category?: string) => void;
  categories?: SkillCategoryDTO[];
  skillName?: string;
}

const LOCAL_STORAGE_KEY = 'custom_skill_icons_cache';

export const TechIconPicker: React.FC<TechIconPickerProps> = ({
  value,
  onChange,
  skillName,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'tech' | 'lucide' | 'custom'>('tech');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [customIcons, setCustomIcons] = useState<CustomIconItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // ignore storage error
      }
    }
    return [];
  });

  useEffect(() => {
    let ignore = false;

    async function loadCustomIcons() {
      try {
        const res = await fetch('/api/custom-icons');
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data.success && Array.isArray(data.icons)) {
            setCustomIcons(data.icons);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.icons));
              } catch {
                // ignore
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }

    void loadCustomIcons();

    return () => {
      ignore = true;
    };
  }, []);

  const allTechSkills = useMemo(() => {
    const customList: PresetSkill[] = customIcons.map((item) => ({
      id: `custom-${item._id || item.url}`,
      name: item.name,
      category: (item.category as PresetSkill['category']) || 'frontend',
      icon: item.url,
    }));
    return { preset: PRESET_SKILLS, custom: customList };
  }, [customIcons]);

  const filteredTechSkills = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (selectedCategory === 'custom') {
      return allTechSkills.custom.filter((s) =>
        q ? s.name.toLowerCase().includes(q) : true
      );
    }

    const filteredPresets = allTechSkills.preset.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && (q.length > 0 ? true : matchesCategory);
    });

    const filteredCustom = allTechSkills.custom.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && (q.length > 0 ? true : matchesCategory);
    });

    return [...filteredCustom, ...filteredPresets];
  }, [search, selectedCategory, allTechSkills]);

  const filteredLucide = useMemo(() => {
    const q = search.toLowerCase().trim();
    return LUCIDE_FALLBACK_ICONS.filter((name) => name.toLowerCase().includes(q));
  }, [search]);

  const handleSelectSkill = (skill: PresetSkill) => {
    onChange(skill.icon, skill.name, skill.category);
    setOpen(false);
    setSearch('');
  };

  const handleSelectLucide = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch('');
  };

  const isUrl = isImageUrl(value);
  const matchedCustom = customIcons.find((c) => c.url === value);
  const matchedPreset = PRESET_SKILLS.find((p) => p.icon === value);

  const displayLabel = useMemo(() => {
    if (!value) return '';
    if (isUrl) return matchedCustom?.name || skillName || 'Custom Icon';
    if (matchedPreset) return matchedPreset.name;
    if (value.startsWith('devicon-')) {
      return value
        .replace('devicon-', '')
        .replace('-plain', '')
        .replace('-original', '')
        .replace('-wordmark', '')
        .replace('colored', '')
        .trim();
    }
    return value;
  }, [value, isUrl, matchedCustom, skillName, matchedPreset]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TechIconPickerTrigger
          value={value}
          displayLabel={displayLabel}
          isUrl={isUrl}
          onClear={() => onChange('')}
        />
      </PopoverTrigger>

      <PopoverContent
        className="w-80 sm:w-92 p-0 bg-popover dark:bg-[#0f172a] text-popover-foreground border border-border shadow-2xl rounded-xl overflow-hidden z-70"
        align="start"
        side="bottom"
        sideOffset={4}
        collisionPadding={12}
        avoidCollisions
      >
        <div className="p-2.5 border-b border-border bg-muted/30 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search icons (e.g. React, Next.js)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-7 h-8 text-xs bg-background border-border rounded-md focus-visible:ring-primary/20"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 p-0.5 bg-muted/60 rounded-lg text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('tech')}
              className={`py-1.5 px-1 rounded-md text-center transition-all flex items-center justify-center gap-1 font-medium cursor-pointer ${
                activeTab === 'tech'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
              <span className="truncate">Tech ({filteredTechSkills.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lucide')}
              className={`py-1.5 px-1 rounded-md text-center transition-all flex items-center justify-center gap-1 font-medium cursor-pointer ${
                activeTab === 'lucide'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shapes className="h-3 w-3 text-blue-500 shrink-0" />
              <span className="truncate">Icons ({filteredLucide.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`py-1.5 px-1 rounded-md text-center transition-all flex items-center justify-center gap-1 font-medium cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PlusCircle className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="truncate">
                Custom {customIcons.length > 0 ? `(${customIcons.length})` : ''}
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'tech' && (
          <TechPresetTab
            search={search}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredTechSkills={filteredTechSkills}
            selectedValue={value}
            onSelectSkill={handleSelectSkill}
            onGoToCustom={() => setActiveTab('custom')}
          />
        )}

        {activeTab === 'lucide' && (
          <LucideIconsTab
            filteredLucide={filteredLucide}
            selectedValue={value}
            onSelectLucide={handleSelectLucide}
          />
        )}

        {activeTab === 'custom' && (
          <CustomIconTab
            customIcons={customIcons}
            setCustomIcons={setCustomIcons}
            selectedValue={value}
            skillName={skillName}
            onSelectIcon={onChange}
            onClosePopover={() => setOpen(false)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default TechIconPicker;
