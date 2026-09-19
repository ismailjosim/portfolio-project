'use client';

import { useEffect, useState } from 'react';
import { LayoutGrid, Orbit, type LucideIcon } from 'lucide-react';
import { getIcon } from '../../lib/iconMapper';
import FadeUp from '../ui/FadeUp';
import { EmptyState, SkillsSkeleton } from '../shared/PublicDataSkeletons';
import OrbitalSkillCard from './OrbitalSkillCard';
import HoverGlowSkillCard from './HoverGlowSkillCard';
import type { SkillItem } from '../../types/skill.interface';

interface SkillGroupData {
  key: string;
  label: string;
  icon: LucideIcon;
  order: number;
  skills: SkillItem[];
}

interface CategoryConfig {
  key: string;
  label: string;
  iconName: string;
  order: number;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  languages: { key: 'languages', label: 'Languages', iconName: 'Code2', order: 1 },
  frontend: { key: 'frontend', label: 'Frontend', iconName: 'Globe', order: 2 },
  backend: { key: 'backend', label: 'Backend', iconName: 'Server', order: 3 },
  'styling-ui': { key: 'styling-ui', label: 'Styling & UI', iconName: 'Palette', order: 4 },
  'styling ui': { key: 'styling-ui', label: 'Styling & UI', iconName: 'Palette', order: 4 },
  'styling & ui': { key: 'styling-ui', label: 'Styling & UI', iconName: 'Palette', order: 4 },
  styling: { key: 'styling-ui', label: 'Styling & UI', iconName: 'Palette', order: 4 },
  database: { key: 'database', label: 'Database', iconName: 'Database', order: 5 },
  'tools-devops': { key: 'tools-devops', label: 'Tools & DevOps', iconName: 'Wrench', order: 6 },
  'tools & devops': { key: 'tools-devops', label: 'Tools & DevOps', iconName: 'Wrench', order: 6 },
  tools: { key: 'tools-devops', label: 'Tools & DevOps', iconName: 'Wrench', order: 6 },
};

function normalizeCategory(rawCat: string): {
  key: string;
  label: string;
  iconName: string;
  order: number;
} {
  const normalizedKey = (rawCat || '').trim().toLowerCase();
  if (CATEGORY_CONFIG[normalizedKey]) {
    return CATEGORY_CONFIG[normalizedKey];
  }

  const formattedLabel = (rawCat || '')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return {
    key: normalizedKey,
    label: formattedLabel || 'Other',
    iconName: 'Wrench',
    order: 99,
  };
}

// --------------------------
// Component
// --------------------------
export default function SkillsSection() {
  const [skillGroups, setSkillGroups] = useState<SkillGroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'bento' | 'orbitals'>('bento');

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch('/api/skills?limit=100&isPublished=true');
        const data = await response.json();

        if (data.skills) {
          // Group skills by normalized category
          const grouped: Record<
            string,
            { key: string; label: string; iconName: string; order: number; skills: SkillItem[] }
          > = {};

          data.skills.forEach((skill: SkillItem) => {
            const catInfo = normalizeCategory(skill.category);
            const groupKey = catInfo.key;
            if (!grouped[groupKey]) {
              grouped[groupKey] = {
                key: groupKey,
                label: catInfo.label,
                iconName: catInfo.iconName,
                order: catInfo.order,
                skills: [],
              };
            }
            grouped[groupKey].skills.push(skill);
          });

          // Sort groups by custom order: Languages -> Frontend -> Backend -> Styling UI -> Database -> Tools
          const sortedGroups: SkillGroupData[] = Object.values(grouped)
            .sort((a, b) => a.order - b.order)
            .map((group) => ({
              key: group.key,
              label: group.label,
              icon: getIcon(group.iconName),
              order: group.order,
              skills: group.skills,
            }));

          setSkillGroups(sortedGroups);
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-24 scroll-mt-20 md:scroll-mt-24">
      <div className="container mx-auto px-6">
        {/* Header with Layout View Switcher */}
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
                What I work with
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
                Technical Skills
              </h2>
            </div>

            {/* Layout Toggle: Bento vs Orbitals */}
            <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/80 self-start sm:self-auto shadow-xs">
              <button
                type="button"
                onClick={() => setLayoutMode('bento')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  layoutMode === 'bento'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Bento Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('orbitals')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  layoutMode === 'orbitals'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Orbit size={14} />
                <span>All Orbitals</span>
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Skill Groups */}
        <FadeUp delay={100}>
          {loading ? (
            <SkillsSkeleton />
          ) : skillGroups.length === 0 ? (
            <EmptyState
              icon="skills"
              title="No skills published yet"
              description="The skill matrix will appear here after published skills are added."
            />
          ) : layoutMode === 'bento' ? (
            /* ── MODERN ASYMMETRIC BENTO GRID ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {skillGroups.map((group, index) => {
                // First category (Languages / Core Stack) is the 2-column featured Orbital Hero
                if (index === 0) {
                  return (
                    <div key={group.key} className="md:col-span-2 lg:col-span-2">
                      <OrbitalSkillCard
                        label={group.label}
                        icon={group.icon}
                        skills={group.skills}
                        categoryKey={group.key}
                      />
                    </div>
                  );
                }

                // Remaining categories are sleek Hover-Glow Grid cards
                return (
                  <HoverGlowSkillCard
                    key={group.key}
                    label={group.label}
                    icon={group.icon}
                    skills={group.skills}
                    categoryKey={group.key}
                  />
                );
              })}
            </div>
          ) : (
            /* ── ALL ORBITALS VIEW ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {skillGroups.map((group) => (
                <OrbitalSkillCard
                  key={group.key}
                  label={group.label}
                  icon={group.icon}
                  skills={group.skills}
                  categoryKey={group.key}
                />
              ))}
            </div>
          )}
        </FadeUp>
      </div>
    </section>
  );
}
