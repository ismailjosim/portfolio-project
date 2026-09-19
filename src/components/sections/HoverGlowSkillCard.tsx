'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import SkillIcon from '../shared/SkillIcon';
import type { SkillItem } from '../../types/skill.interface';

interface HoverGlowSkillCardProps {
  label: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  skills: SkillItem[];
  categoryKey: string;
  className?: string;
}

const CATEGORY_ACCENTS: Record<string, { border: string; glow: string }> = {
  languages: {
    border: 'hover:border-amber-500/50',
    glow: 'rgba(245, 158, 11, 0.08)',
  },
  frontend: {
    border: 'hover:border-cyan-500/50',
    glow: 'rgba(6, 182, 212, 0.08)',
  },
  backend: {
    border: 'hover:border-emerald-500/50',
    glow: 'rgba(16, 185, 129, 0.08)',
  },
  'styling-ui': {
    border: 'hover:border-purple-500/50',
    glow: 'rgba(168, 85, 247, 0.08)',
  },
  database: {
    border: 'hover:border-blue-500/50',
    glow: 'rgba(59, 130, 246, 0.08)',
  },
  'tools-devops': {
    border: 'hover:border-orange-500/50',
    glow: 'rgba(249, 115, 22, 0.08)',
  },
};

export const HoverGlowSkillCard: React.FC<HoverGlowSkillCardProps> = ({
  label,
  icon: GroupIcon,
  skills,
  categoryKey,
  className = '',
}) => {
  const accent = CATEGORY_ACCENTS[categoryKey.toLowerCase()] || {
    border: 'hover:border-primary/50',
    glow: 'rgba(1, 180, 186, 0.08)',
  };

  return (
    <div
      className={`group bg-card dark:bg-slate-950/80 backdrop-blur-md border border-border/80 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 ${accent.border} relative overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Background Radial Ambiance Glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at top left, ${accent.glow} 0%, transparent 70%)`,
        }}
      />

      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
          <GroupIcon size={18} />
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground tracking-tight">{label}</h4>
          <span className="text-[11px] text-muted-foreground">{skills.length} technologies</span>
        </div>
      </div>

      {/* ── Hover-Glow Icon Tiles (Matching tech-stack-icons.com style) ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 my-auto py-2">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="group/tile relative flex items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-white/15 transition-all duration-300 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/20 hover:scale-110 hover:shadow-lg dark:hover:drop-shadow-[0_0_18px_rgba(1,180,186,0.7)] cursor-pointer aspect-square shadow-xs dark:shadow-md"
          >
            {/* Floating Tooltip Badge */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tile:opacity-100 transition-all duration-200 pointer-events-none z-40 px-2.5 py-1 rounded-md bg-slate-950 text-white text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-xl border border-white/20">
              {skill.name}
            </div>

            <SkillIcon
              icon={skill.icon}
              size={24}
              className="transition-transform duration-300 group-hover/tile:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoverGlowSkillCard;
