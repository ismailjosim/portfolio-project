'use client';

import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { Input } from '@/src/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/form';
import type { ProjectFormValues } from './ProjectBasicFields';

export const TECHNOLOGY_OPTIONS = [
  // Frontend
  { label: 'React.js', value: 'React.js' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Redux Toolkit', value: 'Redux Toolkit' },
  { label: 'TanStack Query', value: 'TanStack Query' },
  { label: 'React Router', value: 'React Router' },
  { label: 'React Hook Form', value: 'React Hook Form' },
  { label: 'Tailwind CSS', value: 'Tailwind CSS' },
  { label: 'Material UI', value: 'Material UI' },
  { label: 'Shadcn UI', value: 'Shadcn UI' },
  { label: 'Ant Design', value: 'Ant Design' },

  // Backend
  { label: 'Node.js', value: 'Node.js' },
  { label: 'Express.js', value: 'Express.js' },
  { label: 'REST API', value: 'REST API' },
  { label: 'JWT', value: 'JWT' },
  { label: 'OAuth', value: 'OAuth' },
  { label: 'RBAC', value: 'RBAC' },
  { label: 'Stripe', value: 'Stripe' },
  { label: 'SSLCommerz', value: 'SSLCommerz' },
  { label: 'Nodemailer', value: 'Nodemailer' },
  { label: 'Cloudinary', value: 'Cloudinary' },
  { label: 'Multer', value: 'Multer' },
  { label: 'Redis', value: 'Redis' },
  { label: 'Node-Cron', value: 'Node-Cron' },

  // Database
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'Mongoose', value: 'Mongoose' },
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'Prisma', value: 'Prisma' },

  // Tools
  { label: 'Git', value: 'Git' },
  { label: 'GitHub', value: 'GitHub' },
  { label: 'Linux', value: 'Linux' },
  { label: 'VS Code', value: 'VS Code' },
  { label: 'ESLint', value: 'ESLint' },
  { label: 'Prettier', value: 'Prettier' },
  { label: 'Firebase', value: 'Firebase' },
  { label: 'Vercel', value: 'Vercel' },
  { label: 'Netlify', value: 'Netlify' },
];

interface ProjectTechAndLinksFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ProjectTechAndLinksFields: React.FC<ProjectTechAndLinksFieldsProps> = ({ form }) => {
  return (
    <>
      {/* Technologies */}
      <FormItem>
        <FormLabel>Technologies</FormLabel>
        <Controller
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <CreatableSelect
              isMulti
              unstyled
              options={TECHNOLOGY_OPTIONS}
              placeholder="React, Node.js..."
              value={field.value}
              onChange={field.onChange}
              classNames={{
                control: ({ isFocused }) =>
                  `rounded-lg border px-2 py-1 bg-secondary transition-colors ${
                    isFocused ? 'border-blue-500' : 'border-input hover:border-blue-500'
                  }`,
                menu: () => 'mt-1 rounded-lg border border-secondary bg-secondary shadow-lg',
                menuList: () => 'py-1',
                option: ({ isFocused, isSelected }) =>
                  `px-3 py-2 cursor-pointer text-secondary-foreground transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : isFocused
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-transparent'
                  }`,
                multiValue: () =>
                  'inline-flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-sm mx-1 px-2 py-0.5',
                multiValueLabel: () => 'text-foreground text-sm font-medium leading-none',
                multiValueRemove: ({ isFocused }) =>
                  `ml-0.5 rounded transition-all duration-150 text-muted-foreground hover:bg-destructive hover:text-white ${
                    isFocused ? 'bg-destructive text-white' : ''
                  }`,
                placeholder: () => 'text-muted-foreground',
                input: () => 'text-secondary-foreground',
                indicatorsContainer: () => 'text-muted-foreground',
                clearIndicator: ({ isFocused }) =>
                  `p-1 rounded transition-colors ${isFocused ? 'text-foreground' : ''}`,
                dropdownIndicator: ({ isFocused }) =>
                  `p-1 transition-colors ${isFocused ? 'text-foreground' : ''}`,
              }}
            />
          )}
        />
      </FormItem>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Live URL */}
        <FormField
          control={form.control}
          name="liveUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* GitHub URL */}
        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Case Study URL */}
        <FormField
          control={form.control}
          name="caseStudyUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Study URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default ProjectTechAndLinksFields;
