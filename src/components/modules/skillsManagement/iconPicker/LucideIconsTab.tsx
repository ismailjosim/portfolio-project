'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

export const LUCIDE_FALLBACK_ICONS = [
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

interface LucideIconsTabProps {
  filteredLucide: string[];
  selectedValue: string;
  onSelectLucide: (iconName: string) => void;
}

export const LucideIconsTab: React.FC<LucideIconsTabProps> = ({
  filteredLucide,
  selectedValue,
  onSelectLucide,
}) => {
  return (
    <div className="p-2.5 max-h-52 overflow-y-auto scrollbar-thin">
      <div className="grid grid-cols-5 gap-1.5">
        {filteredLucide.map((iconName) => {
          const IconComponent = (
            LucideIcons as unknown as Record<
              string,
              React.FC<{ size?: number; className?: string }>
            >
          )[iconName];
          if (!IconComponent) return null;
          const isSelected = selectedValue === iconName;

          return (
            <button
              key={iconName}
              type="button"
              title={iconName}
              onClick={() => onSelectLucide(iconName)}
              className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/15 text-primary ring-1 ring-primary'
                  : 'border-border/70 bg-card hover:bg-muted text-foreground'
              }`}
            >
              <IconComponent size={16} className="mb-1" />
              <span className="text-[9px] text-muted-foreground truncate w-full">
                {iconName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LucideIconsTab;
