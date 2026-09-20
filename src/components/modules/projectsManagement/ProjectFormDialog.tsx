'use client';

import React, { useRef, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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

import { uploadImage } from '@/src/services/upload.action';
import {
  createProject,
  updateProject,
  IProjectPayload,
} from '../../../services/project-management';
import { IProject } from '../../../types/project.interface';

import ProjectBasicFields, { ProjectFormValues } from './form/ProjectBasicFields';
import ProjectTechAndLinksFields from './form/ProjectTechAndLinksFields';
import ProjectMediaFields from './form/ProjectMediaFields';

const MAX_DEMO_IMAGES = 10;

interface IProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: IProject;
}

export const ProjectFormDialog: React.FC<IProjectDialogProps> = ({
  open,
  onClose,
  onSuccess,
  project,
}) => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const demoImagesInputRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<File | null>(null);
  const demoFilesRef = useRef<File[]>([]);

  const isEdit = !!project?.slug;

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: '',
      subtitle: '',
      title: '',
      type: '',
      image: null,
      imagePreview: '',
      demoImages: [],
      demoImagesPreview: [],
      description: '',
      technologies: [],
      features: '',
      githubUrl: '',
      liveUrl: '',
      caseStudyUrl: '',
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        subtitle: project.subtitle,
        title: project.title,
        type: project.type,
        image: null,
        imagePreview: project.image,
        demoImages: project.demoImages || [],
        demoImagesPreview: project.demoImages || [],
        description: project.description || '',
        technologies: project.technologies.map((item) => ({
          label: item,
          value: item,
        })),
        features: (project.features || []).join('\n'),
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        caseStudyUrl: project.caseStudyUrl || '',
      });
      demoFilesRef.current = [];
    } else {
      form.reset();
      demoFilesRef.current = [];
    }
  }, [project, form]);

  const imagePreview = useWatch({
    control: form.control,
    name: 'imagePreview',
  });
  const demoImagesPreview =
    useWatch({
      control: form.control,
      name: 'demoImagesPreview',
    }) || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    coverFileRef.current = file;
    const localPreview = URL.createObjectURL(file);
    form.setValue('imagePreview', localPreview);
    form.setValue('image', null);
  };

  const handleDemoImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = demoImagesPreview.length + newFiles.length;

    if (totalImages > MAX_DEMO_IMAGES) {
      toast.error(`Maximum ${MAX_DEMO_IMAGES} images allowed`);
      return;
    }

    demoFilesRef.current = [...demoFilesRef.current, ...newFiles];
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...demoImagesPreview, ...newPreviews];

    form.setValue('demoImagesPreview', updatedPreviews);
  };

  const handleRemoveDemoImage = (index: number) => {
    const updatedPreviews = demoImagesPreview.filter((_, i) => i !== index);
    form.setValue('demoImagesPreview', updatedPreviews);
    form.setValue(
      'demoImages',
      updatedPreviews.filter((preview) => !preview.startsWith('blob:'))
    );

    if (index < demoFilesRef.current.length) {
      demoFilesRef.current = demoFilesRef.current.filter((_, i) => i !== index);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    coverFileRef.current = null;
    demoFilesRef.current = [];
    form.reset();
    onClose();
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      let imageUrl = data.image || (isEdit ? project?.image : '');

      if (coverFileRef.current) {
        const formData = new FormData();
        formData.append('image', coverFileRef.current);

        const result = await uploadImage(formData);
        if (!result.success) {
          toast.error('Image upload failed');
          return;
        }
        imageUrl = result.url!;
      }

      let demoImagesUrls: string[] = [];
      if (isEdit && project?.demoImages) {
        demoImagesUrls = data.demoImages || [];
      }

      if (demoFilesRef.current.length > 0) {
        for (const file of demoFilesRef.current) {
          const formData = new FormData();
          formData.append('image', file);

          const result = await uploadImage(formData);
          if (!result.success) {
            toast.error(`Failed to upload image: ${file.name}`);
            return;
          }
          demoImagesUrls.push(result.url!);
        }
      }

      const payload: IProjectPayload = {
        name: data.name,
        subtitle: data.subtitle,
        title: data.title,
        type: data.type,
        image: imageUrl || '',
        demoImages: demoImagesUrls.length > 0 ? demoImagesUrls : undefined,
        description: data.description,
        technologies: data.technologies.map((item) => item.value),
        features: data.features
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        githubUrl: data.githubUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        caseStudyUrl: data.caseStudyUrl || undefined,
      };

      let result;
      if (isEdit && project?.slug) {
        result = await updateProject(project.slug, payload);
      } else {
        result = await createProject(payload);
      }

      if (!result.success) {
        toast.error(result.message || 'Failed to save project');
        return;
      }

      toast.success(isEdit ? 'Project updated successfully' : 'Project created successfully');
      onSuccess();
      handleClose();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>Add your portfolio project details</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto space-y-4 px-1">
              <ProjectBasicFields form={form} />
              <ProjectTechAndLinksFields form={form} />
              <ProjectMediaFields
                imagePreview={imagePreview}
                demoImagesPreview={demoImagesPreview}
                coverInputRef={coverInputRef}
                demoImagesInputRef={demoImagesInputRef}
                onImageUpload={handleImageUpload}
                onDemoImagesUpload={handleDemoImagesUpload}
                onRemoveCover={() => {
                  coverFileRef.current = null;
                  form.setValue('imagePreview', '');
                  form.setValue('image', null);
                }}
                onRemoveDemoImage={handleRemoveDemoImage}
                maxDemoImages={MAX_DEMO_IMAGES}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
