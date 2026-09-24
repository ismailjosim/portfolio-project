'use client';

import React, { useRef, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../ui/dialog';
import { Form } from '../../ui/form';
import { Button } from '../../ui/button';

import { BlogStatus, IBlog } from '../../../types/blog.interface';
import { createBlog, updateBlog, IBlogPayload } from '../../../services/blog-management';
import { uploadImage } from '@/src/services/upload.action';

import BlogMetaFields, { BlogFormValues } from './form/BlogMetaFields';
import BlogCoverImageField from './form/BlogCoverImageField';
import BlogMarkdownEditorField from './form/BlogMarkdownEditorField';

interface IBlogDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog?: IBlog;
}

export const BlogFormDialog: React.FC<IBlogDialogProps> = ({ open, onClose, onSuccess, blog }) => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const mdFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<File | null>(null);

  const isEdit = !!blog?.slug;
  const { theme } = useTheme();

  const form = useForm<BlogFormValues>({
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      coverImage: null,
      coverImagePreview: '',
      tags: [],
      content: '',
      status: 'draft',
      summary: '',
      scheduledPublishDate: '',
    },
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        slug: blog.slug ?? '',
        category: blog.category,
        coverImage: null,
        coverImagePreview: blog.coverImage ?? '',
        tags: (blog.tags || []).map((tag) =>
          typeof tag === 'string' ? { value: tag, label: tag } : tag
        ),
        content: blog.content,
        status: (blog.status as BlogStatus) || 'draft',
        summary: blog.summary ?? '',
        scheduledPublishDate: blog.scheduledPublishDate
          ? new Date(blog.scheduledPublishDate).toISOString().slice(0, 16)
          : '',
      });
    } else {
      form.reset({
        title: '',
        slug: '',
        category: '',
        coverImage: null,
        coverImagePreview: '',
        tags: [],
        content: '',
        status: 'draft',
        summary: '',
        scheduledPublishDate: '',
      });
    }
  }, [blog, form]);

  const coverPreview = useWatch({
    control: form.control,
    name: 'coverImagePreview',
  });

  const status = useWatch({
    control: form.control,
    name: 'status',
  });

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    coverFileRef.current = file;
    const localPreview = URL.createObjectURL(file);
    form.setValue('coverImagePreview', localPreview);
    form.setValue('coverImage', null);
  };

  const handleMdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.md')) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        form.setValue('content', ev.target.result);
      }
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    if (form.formState.isSubmitting) return;
    coverFileRef.current = null;
    form.reset();
    onClose();
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      let coverImageUrl = data.coverImage;

      if (coverFileRef.current) {
        const formData = new FormData();
        formData.append('image', coverFileRef.current);

        const result = await uploadImage(formData);
        if (!result.success) {
          toast.error('Image upload failed');
          return;
        }

        coverImageUrl = result.url!;
        form.setValue('coverImagePreview', coverImageUrl);
      }

      const payload: IBlogPayload = {
        title: data.title,
        slug: data.slug || undefined,
        category: data.category,
        content: data.content,
        tags: data.tags.map((item) => item.value),
        coverImage: coverImageUrl || undefined,
        status: data.status,
        summary: data.summary || undefined,
        scheduledPublishDate:
          data.status === 'scheduled' && data.scheduledPublishDate
            ? new Date(data.scheduledPublishDate)
            : undefined,
      };

      let result;
      if (isEdit && blog?.slug) {
        result = await updateBlog(blog.slug, payload);
      } else {
        result = await createBlog(payload);
      }

      if (!result.success) {
        // Show the server error message (e.g. duplicate slug, validation error)
        const errorMsg =
          (result as { message?: string }).message ||
          'Failed to save blog. Please check your inputs and try again.';
        toast.error(errorMsg);
        return;
      }

      toast.success(isEdit ? 'Blog updated successfully ✅' : 'Blog created successfully ✅');
      coverFileRef.current = null;
      // Close modal first, then refresh — avoids the dialog staying open
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('BlogFormDialog submit', error);
      toast.error('Something went wrong while saving blog');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-none! w-11/12 md:w-4/5 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your blog post content below.'
              : 'Write your content with markdown support.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
              <BlogMetaFields form={form} status={status} isEdit={isEdit} />
              <BlogCoverImageField
                coverPreview={coverPreview}
                coverInputRef={coverInputRef}
                onCoverUpload={handleCoverUpload}
                onRemoveCover={() => {
                  coverFileRef.current = null;
                  form.setValue('coverImagePreview', '');
                  form.setValue('coverImage', null);
                }}
              />
              <BlogMarkdownEditorField
                form={form}
                theme={theme}
                mdFileInputRef={mdFileInputRef}
                onMdUpload={handleMdUpload}
              />
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Publish Blog'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogFormDialog;
