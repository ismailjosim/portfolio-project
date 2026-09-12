/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { getIcon } from '../../lib/iconMapper';
import FadeUp from '../ui/FadeUp';
import { SkillGroup } from '../../interface/content.interface';
import { EmptyState, SkillsSkeleton } from '../shared/PublicDataSkeletons';

interface Skill {
  _id: string;
  name: string;
  category: string;
  icon?: string;
  proficiency: string;
  description?: string;
  order?: number;
}

interface SkillGroupData extends SkillGroup {
  skills: (Omit<Skill, 'icon'> & { icon: any })[];
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
  'styling-ui': { key: 'styling-ui', label: 'Styling UI', iconName: 'Palette', order: 4 },
  'styling ui': { key: 'styling-ui', label: 'Styling UI', iconName: 'Palette', order: 4 },
  'styling & ui': { key: 'styling-ui', label: 'Styling UI', iconName: 'Palette', order: 4 },
  styling: { key: 'styling-ui', label: 'Styling UI', iconName: 'Palette', order: 4 },
  database: { key: 'database', label: 'Database', iconName: 'Database', order: 5 },
  'tools-devops': { key: 'tools-devops', label: 'Tools', iconName: 'Wrench', order: 6 },
  'tools & devops': { key: 'tools-devops', label: 'Tools', iconName: 'Wrench', order: 6 },
  tools: { key: 'tools-devops', label: 'Tools', iconName: 'Wrench', order: 6 },
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

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch('/api/skills?limit=100&isPublished=true');
        const data = await response.json();

        if (data.skills) {
          // Group skills by normalized category
          const grouped: Record<
            string,
            { label: string; iconName: string; order: number; skills: Skill[] }
          > = {};

          data.skills.forEach((skill: Skill) => {
            const catInfo = normalizeCategory(skill.category);
            const groupKey = catInfo.key;
            if (!grouped[groupKey]) {
              grouped[groupKey] = {
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
              label: group.label,
              icon: getIcon(group.iconName),
              skills: group.skills.map((skill) => ({
                ...skill,
                icon: getIcon(skill.icon),
              })),
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
        {/* Header */}
        <FadeUp>
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
            What I work with
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-16">
            Technical Skills
          </h2>
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillGroups.map(({ label, icon: GroupIcon, skills }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Group Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <GroupIcon size={20} className="text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">{label}</h4>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-3">
                    {skills.map(({ _id, name, icon: SkillIcon }) => (
                      <div
                        key={_id}
                        className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted text-muted-foreground hover:bg-primary hover:text-white transition group cursor-default"
                      >
                        <SkillIcon
                          size={16}
                          className="text-primary group-hover:text-white transition"
                        />
                        <span className="text-sm font-medium">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </FadeUp>
      </div>
    </section>
  );
}
