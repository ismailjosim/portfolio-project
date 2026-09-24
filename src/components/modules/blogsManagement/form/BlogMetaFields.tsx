'use client';

import React, { useEffect, useRef } from 'react';
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
import { AlertCircle } from 'lucide-react';

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

export const MAX_TAGS = 10;

/** Converts a title string into a URL-safe slug */
function toSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export interface BlogFormValues {
  title: string;
  slug?: string;
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
  isEdit?: boolean;
}

export const BlogMetaFields: React.FC<BlogMetaFieldsProps> = ({ form, status, isEdit }) => {
  // Track whether the slug is still being auto-generated from title
  const autoSlugRef = useRef(true);
  const titleValue = form.watch('title');

  useEffect(() => {
    if (!isEdit && autoSlugRef.current && titleValue) {
      form.setValue('slug', toSlug(titleValue), { shouldValidate: false });
    }
  }, [titleValue, form, isEdit]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    autoSlugRef.current = false;
    const cleaned = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    form.setValue('slug', cleaned, { shouldValidate: true });
  };

  const tagCount = form.watch('tags')?.length ?? 0;
  const tagLimitReached = tagCount >= MAX_TAGS;

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

      {/* Slug */}
      <FormField
        control={form.control}
        name="slug"
        rules={{
          pattern: {
            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            message: 'Slug must use lowercase letters, numbers, and hyphens only (e.g. my-blog-post)',
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Slug{' '}
              <span className="text-xs text-muted-foreground font-normal">
                (auto-generated from title, or edit manually)
              </span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="my-blog-post"
                {...field}
                onChange={handleSlugChange}
                className="font-mono text-sm"
              />
            </FormControl>
            <FormMessage />
            {field.value && (
              <p className="text-xs text-muted-foreground">
                URL: <span className="text-foreground">/blogs/{field.value}</span>
              </p>
            )}
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
        <div className="flex items-center justify-between mb-1">
          <FormLabel>Tags</FormLabel>
          <span
            className={`text-xs font-medium tabular-nums transition-colors ${
              tagLimitReached ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {tagCount} / {MAX_TAGS}
          </span>
        </div>

        {tagLimitReached && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive mb-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Maximum {MAX_TAGS} tags allowed. Remove a tag to add another.</span>
          </div>
        )}

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
              isOptionDisabled={() => tagLimitReached}
              noOptionsMessage={({ inputValue }) =>
                tagLimitReached
                  ? `Tag limit reached (${MAX_TAGS} max)`
                  : inputValue
                    ? 'No options — type to create'
                    : 'No options'
              }
              classNames={{
                control: ({ isFocused }) =>
                  `rounded-lg border px-2 py-1 bg-secondary transition-colors ${
                    tagLimitReached
                      ? 'border-destructive/50'
                      : isFocused
                        ? 'border-blue-500'
                        : 'border-input hover:border-blue-500'
                  }`,
                menu: () =>
                  'mt-1 rounded-lg border border-secondary bg-secondary shadow-lg z-50',
                menuList: () => 'py-1',
                option: ({ isFocused, isSelected, isDisabled }) =>
                  `px-3 py-2 cursor-pointer text-secondary-foreground transition-colors ${
                    isDisabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isSelected
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
              placeholder={tagLimitReached ? `Limit reached (${MAX_TAGS} max)` : 'Select or create tags'}
            />
          )}
        />
      </FormItem>
    </>
  );
};

export default BlogMetaFields;
