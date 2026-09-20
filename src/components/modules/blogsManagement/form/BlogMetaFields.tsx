'use client';

import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { Input } from '@/src/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import {
  Select as SelectElement,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { BlogStatus, IBlogTag } from '@/src/types/blog.interface';
import { blogCategories, blogTags as TAG_OPTIONS_ARRAY } from '@/src/constants/blogTaxonomy';

export const BLOG_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const CATEGORIES = Array.from(blogCategories);
export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c, label: c }));

export const TAG_OPTIONS = Array.from(TAG_OPTIONS_ARRAY).map((tag) => ({
  value: tag,
  label: tag,
}));

export interface BlogFormValues {
  title: string;
  category: string;
  content: string;
  tags: IBlogTag[];
  coverImage: string | null;
  coverImagePreview?: string;
  status: BlogStatus;
  summary?: string;
  scheduledPublishDate?: string;
}

interface BlogMetaFieldsProps {
  form: UseFormReturn<BlogFormValues>;
  status: string;
}

export const BlogMetaFields: React.FC<BlogMetaFieldsProps> = ({ form, status }) => {
  return (
    <>
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        rules={{ required: 'Title is required' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="My awesome blog post" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Summary */}
      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Brief description of your blog post (max 500 characters)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category + Status + Scheduled Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Category */}
        <FormItem className="w-full">
          <FormLabel>Category</FormLabel>
          <Controller
            control={form.control}
            name="category"
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <CreatableSelect
                isClearable
                unstyled
                options={CATEGORY_OPTIONS}
                value={field.value ? { value: field.value, label: field.value } : null}
                onChange={(selected) => field.onChange(selected ? selected.value : '')}
                classNames={{
                  control: ({ isFocused }) =>
                    `rounded-lg border px-2 py-1 bg-secondary transition-colors ${
                      isFocused ? 'border-blue-500' : 'border-input hover:border-blue-500'
                    }`,
                  menu: () =>
                    'mt-1 rounded-lg border border-secondary bg-secondary shadow-lg z-50',
                  menuList: () => 'py-1',
                  option: ({ isFocused, isSelected }) =>
                    `px-3 py-2 cursor-pointer text-secondary-foreground transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isFocused
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-transparent'
                    }`,
                  placeholder: () => 'text-muted-foreground',
                  input: () => 'text-secondary-foreground',
                  singleValue: () => 'text-secondary-foreground text-sm',
                  indicatorsContainer: () => 'text-muted-foreground',
                  clearIndicator: ({ isFocused }) =>
                    `p-1 rounded transition-colors ${isFocused ? 'text-foreground' : ''}`,
                  dropdownIndicator: ({ isFocused }) =>
                    `p-1 transition-colors ${isFocused ? 'text-foreground' : ''}`,
                }}
                placeholder="Select or create category"
              />
            )}
          />
          {form.formState.errors.category && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {form.formState.errors.category.message}
            </p>
          )}
        </FormItem>

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          rules={{ required: 'Status is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <SelectElement onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOG_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectElement>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Scheduled Date */}
        {status === 'scheduled' ? (
          <FormField
            control={form.control}
            name="scheduledPublishDate"
            rules={{
              required: status === 'scheduled' ? 'Schedule date is required' : false,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publish Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div />
        )}
      </div>

      {/* Tags */}
      <FormItem>
        <FormLabel>Tags</FormLabel>
        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <CreatableSelect
              isMulti
              unstyled
              options={TAG_OPTIONS}
              value={field.value}
              onChange={(tags) => field.onChange(tags || [])}
              classNames={{
                control: ({ isFocused }) =>
                  `rounded-lg border px-2 py-1 bg-secondary transition-colors ${
                    isFocused ? 'border-blue-500' : 'border-input hover:border-blue-500'
                  }`,
                menu: () =>
                  'mt-1 rounded-lg border border-secondary bg-secondary shadow-lg z-50',
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
              placeholder="Select or create tags"
            />
          )}
        />
      </FormItem>
    </>
  );
};

export default BlogMetaFields;
