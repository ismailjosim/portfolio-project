'use client';

import { Column } from '../../data-table';
import { ISkill } from '@/src/models/Skill';
import { DateCell } from '../../shared/DateCell';
import SkillIcon from '../../shared/SkillIcon';

const skillColumns: Column<ISkill>[] = [
  {
    header: 'Skill',
    accessor: (skill) => (
      <div className="flex items-center gap-3">
        <SkillIcon icon={skill.icon} className="text-xl" size={24} />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{skill.name}</span>
          <span className="text-xs text-muted-foreground">{skill.category}</span>
        </div>
      </div>
    ),
    sortKey: 'name',
  },

  {
    header: 'Proficiency',
    accessor: (skill) => (
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          skill.proficiency === 'expert'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
            : skill.proficiency === 'advanced'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : skill.proficiency === 'intermediate'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}
      >
        {skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1)}
      </span>
    ),
    sortKey: 'proficiency',
  },

  {
    header: 'Category',
    accessor: (skill) => <span className="text-sm">{skill.category}</span>,
    sortKey: 'category',
  },

  {
    header: 'Experience',
    accessor: (skill) => (
      <span className="text-sm">
        {skill.yearsOfExperience !== undefined
          ? `${skill.yearsOfExperience} ${skill.yearsOfExperience === 1 ? 'year' : 'years'}`
          : '-'}
      </span>
    ),
    sortKey: 'yearsOfExperience',
  },

  {
    header: 'Published',
    accessor: (skill) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${skill.isPublished ? 'bg-green-500/20 text-green-600' : 'bg-gray-500/20 text-gray-500'}`}
      >
        {skill.isPublished ? 'Published' : 'Draft'}
      </span>
    ),
    sortKey: 'isPublished',
  },

  {
    header: 'Created',
    accessor: (skill) => <DateCell date={skill.createdAt} />,
    sortKey: 'createdAt',
  },
];

export default skillColumns;
