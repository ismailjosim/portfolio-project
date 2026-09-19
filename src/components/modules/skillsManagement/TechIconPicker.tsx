'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  Search,
  Check,
  X,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Shapes,
  PlusCircle,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';

import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { PRESET_SKILLS, PresetSkill } from '@/src/constants/presetSkills';
import SkillIcon from '@/src/components/shared/SkillIcon';
import { uploadImage } from '@/src/services/upload.action';
import { SkillCategoryDTO } from '@/src/types/skill.interface';

interface TechIconPickerProps {
  value: string;
  onChange: (icon: string, skillName?: string, category?: string) => void;
  categories?: SkillCategoryDTO[];
}

const CATEGORY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Languages', value: 'languages' },
  { label: 'Database', value: 'database' },
  { label: 'DevOps & Tools', value: 'tools-devops' },
  { label: 'UI / CSS', value: 'styling-ui' },
] as const;

const LUCIDE_FALLBACK_ICONS = [
  'Code2',
  'Terminal',
  'Cpu',
  'Binary',
  'Globe',
  'Server',
  'Cloud',
  'Database',
  'DatabaseZap',
  'HardDrive',
  'Palette',
  'Brush',
  'Layers',
  'Layout',
  'Monitor',
  'GitBranch',
  'GitCommit',
  'GitPullRequest',
  'Wrench',
  'Settings',
  'Package',
  'Shield',
  'Lock',
  'Rocket',
  'Zap',
  'Flame',
  'Leaf',
  'Workflow',
  'Component',
];

export const TechIconPicker: React.FC<TechIconPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'tech' | 'lucide' | 'custom'>('tech');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Custom logo state
  const [customName, setCustomName] = useState('');
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter tech icons
  const filteredTechSkills = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PRESET_SKILLS.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && (q.length > 0 ? true : matchesCategory);
    });
  }, [search, selectedCategory]);

  // Filter Lucide icons
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);

      if (res.success && res.url) {
        setCustomLogoUrl(res.url);
        toast.success('Logo uploaded');
      } else {
        const localUrl = URL.createObjectURL(file);
        setCustomLogoUrl(localUrl);
        toast.info('Using local preview');
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setCustomLogoUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyCustom = () => {
    if (!customLogoUrl && !customName.trim()) {
      toast.error('Please upload a logo or enter an icon name');
      return;
    }

    const iconVal = customLogoUrl || customName.trim();
    onChange(iconVal, customName.trim() || undefined);
    setOpen(false);
    setCustomName('');
    setCustomLogoUrl('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between gap-2 h-10 px-3 bg-background border-input font-normal hover:bg-muted/40 cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            {value ? (
              <>
                <SkillIcon icon={value} size={18} className="text-base shrink-0" />
                <span className="truncate text-xs font-medium text-foreground">
                  {value.startsWith('devicon-')
                    ? value
                        .replace('devicon-', '')
                        .replace('-plain', '')
                        .replace('-original', '')
                        .replace('-wordmark', '')
                        .replace('colored', '')
                        .trim()
                    : value}
                </span>
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
                  onChange('');
                }}
                className="p-1 text-muted-foreground hover:text-destructive rounded-full cursor-pointer"
                title="Clear icon"
              >
                <X size={12} />
              </span>
            )}
            <ChevronDown size={14} className="text-muted-foreground opacity-60" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-77.5 sm:w-82.5 p-0 bg-popover dark:bg-[#0f172a] text-popover-foreground border border-border shadow-2xl rounded-xl overflow-hidden z-70"
        align="start"
        side="bottom"
        sideOffset={4}
        collisionPadding={12}
        avoidCollisions
      >
        {/* Compact Search Header */}
        <div className="p-2 border-b border-border bg-muted/30 space-y-1.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search icons (e.g. React, Docker)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-7 h-7 text-xs bg-background border-border rounded-md focus-visible:ring-primary/20"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Clean 3-way Segmented Control */}
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-muted/60 rounded-lg text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('tech')}
              className={`py-1 px-1 rounded-md text-center transition-all flex items-center justify-center gap-1 font-medium ${
                activeTab === 'tech'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Tech ({filteredTechSkills.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lucide')}
              className={`py-1 px-1 rounded-md text-center transition-all flex items-center justify-center gap-1 font-medium ${
                activeTab === 'lucide'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shapes className="h-3 w-3" />
              <span>Icons</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`py-1 px-1 rounded-md text-center transition-all flex items-center justify-center gap-1 font-medium ${
                activeTab === 'custom'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PlusCircle className="h-3 w-3" />
              <span>Custom</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: TECH LOGOS (Compact categorized pills) ── */}
        {activeTab === 'tech' && (
          <div className="flex flex-col">
            {/* Quick Category filter chip bar (only when not searching) */}
            {!search && (
              <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5 border-b border-border/60 bg-muted/10 scrollbar-none text-[10px]">
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat.value
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Compact Pills Scroll Container */}
            <div className="p-2 max-h-36.25 overflow-y-auto scrollbar-thin flex flex-wrap gap-1.5">
              {filteredTechSkills.length === 0 ? (
                <div className="w-full py-5 text-center text-xs text-muted-foreground">
                  No icon found for &quot;{search}&quot;.
                  <button
                    type="button"
                    onClick={() => setActiveTab('custom')}
                    className="block mx-auto mt-1 text-[11px] text-primary hover:underline"
                  >
                    + Add custom logo instead
                  </button>
                </div>
              ) : (
                filteredTechSkills.map((preset) => {
                  const isSelected = value === preset.icon;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectSkill(preset)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium transition-all duration-100 cursor-pointer select-none ${
                        isSelected
                          ? 'border-primary bg-primary/15 text-primary font-semibold ring-1 ring-primary/30'
                          : 'border-border/70 bg-card hover:border-foreground/30 hover:bg-muted/60 text-foreground'
                      }`}
                    >
                      <SkillIcon icon={preset.icon} size={13} className="text-sm shrink-0" />
                      <span className="truncate max-w-30">{preset.name}</span>
                      {isSelected && <Check className="h-2.5 w-2.5 text-primary ml-0.5 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: LUCIDE ICONS (Compact grid) ── */}
        {activeTab === 'lucide' && (
          <div className="p-2 max-h-40 overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-5 gap-1">
              {filteredLucide.map((iconName) => {
                const IconComponent = (
                  LucideIcons as unknown as Record<
                    string,
                    React.FC<{ size?: number; className?: string }>
                  >
                )[iconName];
                if (!IconComponent) return null;
                const isSelected = value === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    title={iconName}
                    onClick={() => handleSelectLucide(iconName)}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-md border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                        : 'border-border/70 bg-card hover:bg-muted text-foreground'
                    }`}
                  >
                    <IconComponent size={15} className="mb-0.5" />
                    <span className="text-[9px] text-muted-foreground truncate w-full">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: CUSTOM LOGO / UPLOAD ── */}
        {activeTab === 'custom' && (
          <div className="p-2.5 space-y-2.5">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                Skill / Logo Name
              </label>
              <Input
                placeholder="e.g. Apollo Client"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                Upload Custom Logo (PNG / SVG)
              </label>
              <div className="flex items-center justify-between p-2 rounded-lg border border-dashed border-border bg-muted/20">
                <div className="flex items-center gap-2 truncate">
                  {customLogoUrl ? (
                    <SkillIcon icon={customLogoUrl} size={18} className="text-base" />
                  ) : (
                    <ImageIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span className="text-[11px] text-muted-foreground truncate">
                    {customLogoUrl ? 'Logo ready' : 'PNG or SVG image'}
                  </span>
                </div>

                <input
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-6 text-[10px] font-medium px-2"
                >
                  {isUploading ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Upload className="h-3 w-3 mr-1" />
                  )}
                  {customLogoUrl ? 'Change' : 'Upload'}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                size="sm"
                onClick={handleApplyCustom}
                disabled={!customLogoUrl && !customName.trim()}
                className="h-7 text-xs font-semibold px-3 w-full"
              >
                Apply Custom Icon
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default TechIconPicker;
