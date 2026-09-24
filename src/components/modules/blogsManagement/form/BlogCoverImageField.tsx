'use client';

import React, { RefObject } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { FormLabel } from '@/src/components/ui/form';

interface BlogCoverImageFieldProps {
  coverPreview?: string;
  coverInputRef: RefObject<HTMLInputElement | null>;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCover: () => void;
}

export const BlogCoverImageField: React.FC<BlogCoverImageFieldProps> = ({
  coverPreview,
  coverInputRef,
  onCoverUpload,
  onRemoveCover,
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>Cover Image (Optional)</FormLabel>
      <div className="flex items-center gap-4">
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={onCoverUpload}
          className="hidden"
        />

        {coverPreview ? (
          <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-border group">
            <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-7 text-xs cursor-pointer"
                onClick={onRemoveCover}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => coverInputRef.current?.click()}
            className="w-40 h-24 border-dashed border-2 flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload Cover</span>
          </Button>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Recommended: 1200 x 630 px (16:9 ratio)</p>
          <p>Supported formats: JPG, PNG, WebP</p>
        </div>
      </div>
    </div>
  );
};

export default BlogCoverImageField;
