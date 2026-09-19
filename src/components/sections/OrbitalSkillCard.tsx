'use client';

import React, { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import SkillIcon from '../shared/SkillIcon';
import type { SkillItem } from '../../types/skill.interface';

// Re-export for convenience
export type { SkillItem };

interface OrbitalSkillCardProps {
  label: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  skills: SkillItem[];
  categoryKey: string;
}

// Hierarchy: expert (1) -> advanced (2) -> intermediate (3) -> beginner (4)
const PROFICIENCY_RANK: Record<string, number> = {
  expert: 1,
  advanced: 2,
  intermediate: 3,
  beginner: 4,
};

// Category theme styling
const CATEGORY_THEMES: Record<
  string,
  { glow: string; borderHover: string; centerBorder: string; centerGlow: string }
> = {
  languages: {
    glow: 'rgba(245, 158, 11, 0.12)',
    borderHover: 'hover:border-amber-500/50',
    centerBorder: 'border-amber-500/40',
    centerGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.28)]',
  },
  frontend: {
    glow: 'rgba(6, 182, 212, 0.12)',
    borderHover: 'hover:border-cyan-500/50',
    centerBorder: 'border-cyan-500/40',
    centerGlow: 'shadow-[0_0_35px_rgba(6,182,212,0.28)]',
  },
  backend: {
    glow: 'rgba(16, 185, 129, 0.12)',
    borderHover: 'hover:border-emerald-500/50',
    centerBorder: 'border-emerald-500/40',
    centerGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.28)]',
  },
  'styling-ui': {
    glow: 'rgba(168, 85, 247, 0.12)',
    borderHover: 'hover:border-purple-500/50',
    centerBorder: 'border-purple-500/40',
    centerGlow: 'shadow-[0_0_35px_rgba(168,85,247,0.28)]',
  },
  database: {
    glow: 'rgba(59, 130, 246, 0.12)',
    borderHover: 'hover:border-blue-500/50',
    centerBorder: 'border-blue-500/40',
    centerGlow: 'shadow-[0_0_35px_rgba(59,130,246,0.28)]',
  },
  'tools-devops': {
    glow: 'rgba(249, 115, 22, 0.12)',
    borderHover: 'hover:border-orange-500/50',
    centerBorder: 'border-orange-500/40',
    centerGlow: 'shadow-[0_0_35px_rgba(249,115,22,0.28)]',
  },
};

export const OrbitalSkillCard: React.FC<OrbitalSkillCardProps> = ({
  label,
  icon: GroupIcon,
  skills,
  categoryKey,
}) => {
  // Sort skills strictly by proficiency rank: Expert 1st -> Advanced -> Intermediate -> Beginner
  const rankedSkills = useMemo(() => {
    return [...skills].sort((a, b) => {
      const rankA = PROFICIENCY_RANK[(a.proficiency || '').toLowerCase()] ?? 99;
      const rankB = PROFICIENCY_RANK[(b.proficiency || '').toLowerCase()] ?? 99;
      if (rankA !== rankB) return rankA - rankB;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [skills]);

  const orbitCount = rankedSkills.length;
  // Proportional orbit radius to fit card perfectly without excess empty space
  const orbitRadius = orbitCount <= 5 ? 98 : 108;
  const trackDiameter = orbitRadius * 2;

  const theme = CATEGORY_THEMES[categoryKey.toLowerCase()] || {
    glow: 'rgba(1, 180, 186, 0.12)',
    borderHover: 'hover:border-primary/50',
    centerBorder: 'border-primary/40',
    centerGlow: 'shadow-[0_0_35px_rgba(1,180,186,0.28)]',
  };

  return (
    <div
      className={`group bg-card dark:bg-slate-950/80 backdrop-blur-md border border-border/80 dark:border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 ${theme.borderHover} relative overflow-hidden flex items-center justify-center hover-pause`}
    >
      {/* Background Radial Ambiance Glow (Subtle in light mode, luminous in dark mode) */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${theme.glow} 0%, transparent 70%)`,
        }}
      />

      {/* ── Orbital Ring Showcase (Centered, snug fit without excess empty space) ── */}
      <div className="relative w-full h-67.5 sm:h-82.5 flex items-center justify-center select-none">
        {/* Decorative Inner Track (for categories with fewer skills) */}
        {orbitCount <= 5 && (
          <div className="absolute w-27 h-27 rounded-full border border-dashed border-slate-200 dark:border-white/5 pointer-events-none" />
        )}

        {/* Orbital Track (Circular Dashed Guide Rings) */}
        <div
          className="absolute rounded-full border border-dashed border-slate-300/80 dark:border-white/15 pointer-events-none"
          style={{ width: `${trackDiameter}px`, height: `${trackDiameter}px` }}
        />
        <div
          className="absolute rounded-full border border-slate-200/60 dark:border-white/5 pointer-events-none"
          style={{ width: `${trackDiameter + 10}px`, height: `${trackDiameter + 10}px` }}
        />

        {/* ── Central Category Hub (Prominent, Multi-line wrapping, No overflow) ── */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center w-22 h-22 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:${theme.centerBorder} shadow-md dark:${theme.centerGlow} p-2 text-center transition-transform duration-300 group-hover:scale-105`}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-1 shrink-0 shadow-xs">
            <GroupIcon size={18} />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-foreground tracking-tight leading-tight px-1 max-w-full text-center line-clamp-2">
            {label}
          </span>
          <span className="text-[9px] text-muted-foreground font-medium mt-0.5">
            {skills.length} skills
          </span>
        </div>

        {/* ── Orbiting Tech Stack Skills Ring (z-30 so tooltips float above center hub) ── */}
        {orbitCount > 0 && (
          <div
            className="absolute inset-0 m-auto animate-orbit pointer-events-none z-30"
            style={{ width: `${trackDiameter}px`, height: `${trackDiameter}px` }}
          >
            {rankedSkills.map((skill, index) => {
              // 1st position (Expert) starts at top (-90 degrees / 12 o'clock)
              const angleDeg = -90 + (index * 360) / orbitCount;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = Math.round(orbitRadius * Math.cos(angleRad));
              const y = Math.round(orbitRadius * Math.sin(angleRad));

              // If icon is in bottom half of the orbit, display tooltip BELOW the icon to prevent overlapping center hub
              const isBottomHalf = y > 15;

              return (
                <div
                  key={skill._id}
                  className="absolute pointer-events-auto hover:z-50"
                  style={{
                    left: `calc(50% + ${x}px - 22px)`,
                    top: `calc(50% + ${y}px - 22px)`,
                  }}
                >
                  {/* Counter-rotate icon container so icons remain upright */}
                  <div className="animate-counter-orbit">
                    <div className="group/sat relative flex items-center justify-center w-11 h-11 sm:w-11.5 sm:h-11.5 rounded-2xl bg-white dark:bg-slate-800/85 border border-slate-200/90 dark:border-white/20 transition-all duration-300 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/20 hover:scale-125 hover:shadow-xl dark:hover:drop-shadow-[0_0_20px_rgba(1,180,186,0.85)] cursor-pointer shadow-md dark:shadow-sm">
                      {/* Floating Tooltip pointing outward (below for bottom icons, above for top icons) */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 opacity-0 group-hover/sat:opacity-100 transition-all duration-200 pointer-events-none z-50 px-2.5 py-1 rounded-md bg-slate-950 dark:bg-slate-900 text-white text-xs font-semibold tracking-wide whitespace-nowrap shadow-2xl border border-white/20 ${
                          isBottomHalf ? 'top-full mt-2.5' : '-top-9'
                        }`}
                      >
                        {skill.name}
                      </div>

                      <SkillIcon icon={skill.icon} size={26} className="shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrbitalSkillCard;
