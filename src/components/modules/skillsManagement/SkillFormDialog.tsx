'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Loader2 } from 'lucide-react';
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

import { createSkill, updateSkill, ISkillPayload } from '../../../services/skill-management';
import { ISkill } from '../../../models/Skill';
import { SkillCategoryDTO } from '@/src/types/skill.interface';
import SkillFormFields, { SkillFormValues } from './form/SkillFormFields';

const DEFAULT_CATEGORIES: SkillCategoryDTO[] = [
  {
    id: 'languages',
    label: 'Languages',
    slug: 'languages',
    iconName: 'Code2',
    order: 0,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'frontend',
    label: 'Frontend',
    slug: 'frontend',
    iconName: 'Globe',
    order: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'backend',
    label: 'Backend',
    slug: 'backend',
    iconName: 'Server',
    order: 2,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'styling-ui',
    label: 'Styling UI',
    slug: 'styling-ui',
    iconName: 'Palette',
    order: 3,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'database',
    label: 'Database',
    slug: 'database',
    iconName: 'Database',
    order: 4,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'tools-devops',
    label: 'Tools',
    slug: 'tools-devops',
    iconName: 'Wrench',
    order: 5,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'payment-validation',
    label: 'Payment & Validation',
    slug: 'payment-validation',
    iconName: 'CreditCard',
    order: 6,
    createdAt: '',
    updatedAt: '',
  },
];

interface ISkillDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skill?: ISkill;
  categories?: SkillCategoryDTO[];
}

export const SkillFormDialog: React.FC<ISkillDialogProps> = ({
  open,
  onClose,
  onSuccess,
  skill,
  categories,
}) => {
  const isEdit = !!skill?._id;

  const form = useForm<SkillFormValues>({
    defaultValues: {
      name: '',
      categoryId: '',
      proficiency: 'intermediate',
      description: '',
      yearsOfExperience: undefined,
      icon: '',
      isPublished: true,
    },
  });

  useEffect(() => {
    if (skill) {
      form.reset({
        name: skill.name,
        categoryId: skill.category ?? '',
        proficiency: skill.proficiency,
        description: skill.description || '',
        yearsOfExperience: skill.yearsOfExperience,
        icon: skill.icon || '',
        isPublished: skill.isPublished,
      });
    } else {
      form.reset({
        name: '',
        categoryId: '',
        proficiency: 'intermediate',
        description: '',
        yearsOfExperience: undefined,
        icon: '',
        isPublished: true,
      });
    }
  }, [skill, form, open]);

  const handleClose = () => {
    if (form.formState.isSubmitting) return;
    form.reset();
    onClose();
  };

  const onSubmit = async (data: SkillFormValues) => {
    try {
      const payload: ISkillPayload = {
        name: data.name,
        category: data.categoryId,
        proficiency: data.proficiency,
        description: data.description,
        yearsOfExperience: data.yearsOfExperience,
        icon: data.icon,
        isPublished: data.isPublished,
      };

      if (isEdit && skill) {
        const result = await updateSkill(skill._id!.toString(), payload);
        if (result.success) {
          toast.success(result.message || 'Skill updated successfully');
          form.reset();
          onSuccess();
          onClose();
        } else {
          toast.error(result.message || 'Failed to update skill');
        }
      } else {
        const result = await createSkill(payload);
        if (result.success) {
          toast.success('Skill created successfully');
          form.reset();
          onSuccess();
          onClose();
        } else {
          toast.error(result.message || 'Failed to create skill');
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  const availableCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the details of this skill' : 'Add a new skill to your portfolio'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-1 scrollbar-thin">
              <SkillFormFields form={form} availableCategories={availableCategories} />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {form.formState.isSubmitting
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : isEdit
                    ? 'Update Skill'
                    : 'Create Skill'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillFormDialog;
