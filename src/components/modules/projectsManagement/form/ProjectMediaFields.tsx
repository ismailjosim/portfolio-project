'use client';

import React, { RefObject } from 'react';
import Image from 'next/image';
import { Upload, Plus, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { FormLabel } from '@/src/components/ui/form';

interface ProjectMediaFieldsProps {
  imagePreview?: string;
  demoImagesPreview: string[];
  coverInputRef: RefObject<HTMLInputElement | null>;
  demoImagesInputRef: RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDemoImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCover: () => void;
  onRemoveDemoImage: (index: number) => void;
  maxDemoImages: number;
}

export const ProjectMediaFields: React.FC<ProjectMediaFieldsProps> = ({
  imagePreview,
  demoImagesPreview,
  coverInputRef,
  demoImagesInputRef,
  onImageUpload,
  onDemoImagesUpload,
  onRemoveCover,
  onRemoveDemoImage,
  maxDemoImages,
}) => {
  return (
    <>
      {/* Cover Image Upload */}
      <div className="space-y-2">
        <FormLabel>Cover Image</FormLabel>
        <div className="flex items-center gap-4">
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-border group">
              <Image src={imagePreview} alt="Cover Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={onRemoveCover}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => coverInputRef.current?.click()}
              className="w-32 h-20 border-dashed border-2 flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload Cover</span>
            </Button>
          )}

          <div className="text-xs text-muted-foreground">
            <p>Recommended: 1200 x 630 px</p>
            <p>Supports: JPG, PNG, WebP</p>
          </div>
        </div>
      </div>

      {/* Demo Screenshots Upload */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>Demo Screenshots (Max {maxDemoImages})</FormLabel>
          <span className="text-xs text-muted-foreground">
            {demoImagesPreview.length}/{maxDemoImages} images
          </span>
        </div>

        <input
          ref={demoImagesInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onDemoImagesUpload}
          className="hidden"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {demoImagesPreview.map((preview, index) => (
            <div
              key={preview + index}
              className="relative aspect-video rounded-lg overflow-hidden border border-border group"
            >
              <Image src={preview} alt={`Demo ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveDemoImage(index)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {demoImagesPreview.length < maxDemoImages && (
            <Button
              type="button"
              variant="outline"
              onClick={() => demoImagesInputRef.current?.click()}
              className="aspect-video border-dashed border-2 flex flex-col items-center justify-center gap-1 cursor-pointer w-full h-auto"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Add Screenshot</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectMediaFields;
