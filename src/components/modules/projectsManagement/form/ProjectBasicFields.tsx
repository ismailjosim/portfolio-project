'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';

export interface ProjectFormValues {
  name: string;
  subtitle: string;
  title: string;
  type: string;
  image: string | null;
  imagePreview?: string;
  demoImages: string[];
  demoImagesPreview?: string[];
  description: string;
  technologies: { label: string; value: string }[];
  features: string;
  githubUrl: string;
  liveUrl: string;
  caseStudyUrl: string;
}

interface ProjectBasicFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ProjectBasicFields: React.FC<ProjectBasicFieldsProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Name */}
        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'Project Name is Required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="TRAVELER" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* subtitle */}
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Tour Management" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          rules={{ required: 'Required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Traveler — Tour Management System" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Full Stack Web Application" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder="Short project summary..." {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Features */}
      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Features (One per line)</FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                placeholder="User authentication with JWT&#10;Stripe payment gateway&#10;Admin management dashboard"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default ProjectBasicFields;
