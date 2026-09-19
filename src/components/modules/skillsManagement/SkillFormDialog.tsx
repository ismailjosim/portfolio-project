'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// shadcn ui
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import {
  Select as SelectElement,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';

import { createSkill, updateSkill, ISkillPayload } from '../../../services/skill-management';
import { ISkill } from '../../../models/Skill';
import { SkillCategoryDTO } from '@/src/types/skill.interface';
import TechIconPicker from './TechIconPicker';

// ─── Constants ─────────────────────────────────────────────

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const DEFAULT_CATEGORIES: SkillCategoryDTO[] = [
  { id: 'languages', label: 'Languages', slug: 'languages', iconName: 'Code2', order: 0, createdAt: '', updatedAt: '' },
  { id: 'frontend', label: 'Frontend', slug: 'frontend', iconName: 'Globe', order: 1, createdAt: '', updatedAt: '' },
  { id: 'backend', label: 'Backend', slug: 'backend', iconName: 'Server', order: 2, createdAt: '', updatedAt: '' },
  { id: 'styling-ui', label: 'Styling UI', slug: 'styling-ui', iconName: 'Palette', order: 3, createdAt: '', updatedAt: '' },
  { id: 'database', label: 'Database', slug: 'database', iconName: 'Database', order: 4, createdAt: '', updatedAt: '' },
  { id: 'tools-devops', label: 'Tools', slug: 'tools-devops', iconName: 'Wrench', order: 5, createdAt: '', updatedAt: '' },
  { id: 'payment-validation', label: 'Payment & Validation', slug: 'payment-validation', iconName: 'CreditCard', order: 6, createdAt: '', updatedAt: '' },
];

// ─── Types ─────────────────────────────────────────────────

interface SkillFormValues {
  name: string;
  categoryId: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
  yearsOfExperience?: number;
  icon?: string;
  isPublished?: boolean;
}

interface ISkillDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skill?: ISkill;
  /** Pass all available categories for the dropdown */
  categories?: SkillCategoryDTO[];
}

// ─── Component ─────────────────────────────────────────────

const SkillFormDialog = ({ open, onClose, onSuccess, skill, categories }: ISkillDialogProps) => {
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
                            // Auto-fill skill name if currently empty
                            if (skillName && !form.getValues('name')) {
                              form.setValue('name', skillName, { shouldValidate: true });
                            }
                            // Auto-select matching category if currently empty
                            if (category && !form.getValues('categoryId')) {
                              const matched = availableCategories.find(
                                (c) => c.id.toLowerCase() === category.toLowerCase() || c.slug.toLowerCase() === category.toLowerCase()
                              );
                              if (matched) {
                                form.setValue('categoryId', matched.id, { shouldValidate: true });
                              }
                            }
                          }}
                          categories={availableCategories}
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
            </div>

            {/* ── Footer ── */}
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
