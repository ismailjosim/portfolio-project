'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { Input } from '@/src/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import {
  Select as SelectElement,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { BlogStatus, IBlogTag, IBlog } from '@/src/types/blog.interface';
import { blogCategories, blogTags as TAG_OPTIONS_ARRAY } from '@/src/constants/blogTaxonomy';
import { getPublishedBlogs } from '@/src/services/blog-management';

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
  related: { value: string; label: string }[];
}

interface BlogMetaFieldsProps {
  form: UseFormReturn<BlogFormValues>;
  status: string;
  isEdit?: boolean;
  children?: React.ReactNode;
}

export const BlogMetaFields: React.FC<BlogMetaFieldsProps> = ({
  form,
  status,
  isEdit,
  children,
}) => {
  // Track whether the slug is still being auto-generated from title
  const autoSlugRef = useRef(true);
  const titleValue = form.watch('title');

  const [relatedOptions, setRelatedOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const res = await getPublishedBlogs({ limit: 100 });
      if (res.success && res.data) {
        setRelatedOptions(
          res.data
            // Don't show current blog in related options
            .filter((b: IBlog) => b.slug !== form.getValues('slug'))
            .map((b: IBlog) => ({
              value: b._id as string,
              label: b.title,
            }))
        );
      }
    }
    fetchBlogs();
  }, [form]);

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
      {/* Title and Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
              message:
                'Slug must use lowercase letters, numbers, and hyphens only (e.g. my-blog-post)',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Slug{' '}
                <span className="text-xs text-muted-foreground font-normal">
                  (auto-generated or edit)
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
      </div>

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

      {/* Category + Tags + Status */}
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
                  menu: () => 'mt-1 rounded-lg border border-secondary bg-secondary shadow-lg z-50',
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
                placeholder="Select or create"
              />
            )}
          />
          {form.formState.errors.category && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {form.formState.errors.category.message}
            </p>
          )}
        </FormItem>

        {/* Tags */}
        <FormItem>
          <div className="flex items-center justify-between mb-1">
            <FormLabel>Tags</FormLabel>
            <span
              className={`text-[10px] font-medium tabular-nums transition-colors ${
                tagLimitReached ? 'text-destructive' : 'text-muted-foreground'
              }`}
            >
              {tagCount} / {MAX_TAGS}
            </span>
          </div>

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
                  tagLimitReached ? `Limit reached` : inputValue ? 'Type to create' : 'No options'
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
                  menu: () => 'mt-1 rounded-lg border border-secondary bg-secondary shadow-lg z-50',
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
                    'inline-flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-sm mx-1 px-1 py-0.5',
                  multiValueLabel: () => 'text-foreground text-xs font-medium leading-none',
                  multiValueRemove: ({ isFocused }) =>
                    `ml-0.5 rounded transition-all duration-150 text-muted-foreground hover:bg-destructive hover:text-white ${
                      isFocused ? 'bg-destructive text-white' : ''
                    }`,
                  placeholder: () => 'text-muted-foreground text-sm',
                  input: () => 'text-secondary-foreground text-sm',
                  indicatorsContainer: () => 'text-muted-foreground',
                  clearIndicator: ({ isFocused }) =>
                    `p-1 rounded transition-colors ${isFocused ? 'text-foreground' : ''}`,
                  dropdownIndicator: ({ isFocused }) =>
                    `p-1 transition-colors ${isFocused ? 'text-foreground' : ''}`,
                }}
                placeholder={tagLimitReached ? `Limit (${MAX_TAGS})` : 'Select tags'}
              />
            )}
          />
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
      </div>

      {/* Scheduled Date (Rendered separately below if status is scheduled) */}
      {status === 'scheduled' && (
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
      )}

      {/* Related Articles & Cover Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Related Articles */}
        <FormItem>
          <div className="flex items-center justify-between mb-1">
            <FormLabel>Related Articles</FormLabel>
            <span
              className={`text-[10px] font-medium tabular-nums transition-colors ${
                (form.watch('related')?.length ?? 0) >= 3
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              }`}
            >
              {form.watch('related')?.length ?? 0} / 3
            </span>
          </div>

          <Controller
            control={form.control}
            name="related"
            render={({ field }) => (
              <Select
                isMulti
                unstyled
                options={relatedOptions}
                value={field.value}
                onChange={(items) => field.onChange(items || [])}
                isOptionDisabled={() => (field.value?.length ?? 0) >= 3}
                classNames={{
                  control: ({ isFocused }) =>
                    `rounded-lg border px-2 py-1 bg-secondary transition-colors ${
                      (field.value?.length ?? 0) >= 3
                        ? 'border-destructive/50'
                        : isFocused
                          ? 'border-blue-500'
                          : 'border-input hover:border-blue-500'
                    }`,
                  menu: () => 'mt-1 rounded-lg border border-secondary bg-secondary shadow-lg z-50',
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
                    'inline-flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-sm mx-1 px-1 py-0.5',
                  multiValueLabel: () => 'text-foreground text-xs font-medium leading-none',
                  multiValueRemove: ({ isFocused }) =>
                    `ml-0.5 rounded transition-all duration-150 text-muted-foreground hover:bg-destructive hover:text-white ${
                      isFocused ? 'bg-destructive text-white' : ''
                    }`,
                  placeholder: () => 'text-muted-foreground text-sm',
                  input: () => 'text-secondary-foreground text-sm',
                  indicatorsContainer: () => 'text-muted-foreground',
                  clearIndicator: ({ isFocused }) =>
                    `p-1 rounded transition-colors ${isFocused ? 'text-foreground' : ''}`,
                  dropdownIndicator: ({ isFocused }) =>
                    `p-1 transition-colors ${isFocused ? 'text-foreground' : ''}`,
                }}
                placeholder={
                  (field.value?.length ?? 0) >= 3 ? 'Limit (3 max)' : 'Select related articles'
                }
              />
            )}
          />
        </FormItem>

        {/* Cover Image field passed as children */}
        {children && <div className="mt-0">{children}</div>}
      </div>
    </>
  );
};

export default BlogMetaFields;
