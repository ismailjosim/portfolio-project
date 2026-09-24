'use client';

import React, { RefObject } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import MDEditor from '@uiw/react-md-editor';
import { FileUp } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { FormItem, FormLabel } from '@/src/components/ui/form';
import type { BlogFormValues } from './BlogMetaFields';

interface BlogMarkdownEditorFieldProps {
  form: UseFormReturn<BlogFormValues>;
  theme?: string;
  mdFileInputRef: RefObject<HTMLInputElement | null>;
  onMdUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BlogMarkdownEditorField: React.FC<BlogMarkdownEditorFieldProps> = ({
  form,
  theme,
  mdFileInputRef,
  onMdUpload,
}) => {
  return (
    <FormItem>
      <div className="flex items-center justify-between">
        <FormLabel>Content (Markdown)</FormLabel>
        <div>
          <input
            ref={mdFileInputRef}
            type="file"
            accept=".md,text/markdown"
            onChange={onMdUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => mdFileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <FileUp className="w-3.5 h-3.5" />
            Import .md file
          </Button>
        </div>
      </div>

      <Controller
        control={form.control}
        name="content"
        rules={{ required: 'Content is required' }}
        render={({ field }) => (
          <div data-color-mode={theme === 'dark' ? 'dark' : 'light'} className="rounded-md border">
            <MDEditor value={field.value} onChange={field.onChange} height={360} preview="edit" />
          </div>
        )}
      />
      {form.formState.errors.content && (
        <p className="text-[0.8rem] font-medium text-destructive">
          {form.formState.errors.content.message}
        </p>
      )}
    </FormItem>
  );
};

export default BlogMarkdownEditorField;
