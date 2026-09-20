'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import {
  Select as SelectElement,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Checkbox } from '@/src/components/ui/checkbox';
import { SkillCategoryDTO } from '@/src/types/skill.interface';
import TechIconPicker from '../TechIconPicker';

export interface SkillFormValues {
  name: string;
  categoryId: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
  yearsOfExperience?: number;
  icon?: string;
  isPublished?: boolean;
}

export const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

interface SkillFormFieldsProps {
  form: UseFormReturn<SkillFormValues>;
  availableCategories: SkillCategoryDTO[];
}

export const SkillFormFields: React.FC<SkillFormFieldsProps> = ({
  form,
  availableCategories,
}) => {
  const currentSkillName = form.watch('name');

  return (
    <>
      {/* ── Row 1: Name + Category ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'Skill name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category dropdown */}
        <FormField
          control={form.control}
          name="categoryId"
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <SelectElement value={field.value || ''} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full bg-background!">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="bg-popover!">
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectElement>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ── Row 2: Proficiency + Years ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="proficiency"
          rules={{ required: 'Proficiency level is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proficiency Level</FormLabel>
              <SelectElement value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full bg-background!">
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" side="bottom" className="bg-popover!">
                  {PROFICIENCY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectElement>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={50}
                  placeholder="e.g. 3"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* ── Row 3: Icon Picker + Description ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <TechIconPicker
                  value={field.value ?? ''}
                  onChange={(icon, skillName, category) => {
                    field.onChange(icon);
                    if (skillName && !form.getValues('name')) {
                      form.setValue('name', skillName, { shouldValidate: true });
                    }
                    if (category && !form.getValues('categoryId')) {
                      const matched = availableCategories.find(
                        (c) =>
                          c.id.toLowerCase() === category.toLowerCase() ||
                          c.slug.toLowerCase() === category.toLowerCase()
                      );
                      if (matched) {
                        form.setValue('categoryId', matched.id, { shouldValidate: true });
                      }
                    }
                  }}
                  categories={availableCategories}
                  skillName={currentSkillName}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Select an authentic tech logo or custom icon.
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Brief description of your experience with this skill…"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* ── Row 4: Publish toggle ── */}
      <FormField
        control={form.control}
        name="isPublished"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3 rounded-md border p-3">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div>
              <FormLabel className="m-0 cursor-pointer">Publish this skill</FormLabel>
              <p className="text-xs text-muted-foreground">
                Visible on your public portfolio
              </p>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default SkillFormFields;
