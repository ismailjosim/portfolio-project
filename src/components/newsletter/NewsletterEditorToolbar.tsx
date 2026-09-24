'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Sparkles,
  User,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface NewsletterEditorToolbarProps {
  onInsert: (text: string) => void;
  isUploadingImage: boolean;
  onUploadImage: (file: File) => void;
}

export function NewsletterEditorToolbar({
  onInsert,
  isUploadingImage,
  onUploadImage,
}: NewsletterEditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    onUploadImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddLink = () => {
    const url = prompt('Enter the URL (e.g. https://github.com/username):');
    if (!url) return;
    const title = prompt('Enter the link title (optional):', 'Click here') || 'Click here';
    onInsert(`[${title}](${url})`);
  };

  const handleAddButton = () => {
    const url = prompt('Enter button link URL (e.g. https://www.ismailjosim.com/projects):');
    if (!url) return;
    const label = prompt('Enter button text:', '👉 View Project') || '👉 View Project';
    onInsert(`\n\n[button:${label}](${url})\n\n`);
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-end">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 px-2.5 text-xs"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploadingImage}
        title="Upload & attach photo"
      >
        {isUploadingImage ? (
          <Loader2 className="size-3.5 animate-spin mr-1" />
        ) : (
          <ImageIcon className="size-3.5 mr-1 text-emerald-500" />
        )}
        Photo
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 px-2 text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20"
        onClick={() => onInsert('{{name}}')}
        title="Insert dynamic subscriber name merge tag"
      >
        <User className="size-3.5 mr-1" />
        {'{{name}}'}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 px-2.5 text-xs"
        onClick={handleAddButton}
        title="Insert Call-to-action button"
      >
        <Sparkles className="size-3.5 mr-1 text-primary" />
        Button
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 px-2.5 text-xs"
        onClick={handleAddLink}
        title="Insert link"
      >
        <LinkIcon className="size-3.5 mr-1 text-blue-500" />
        Link
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs font-bold"
        onClick={() => onInsert('**bold text**')}
        title="Bold"
      >
        <Bold className="size-3.5" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs italic"
        onClick={() => onInsert('*italic text*')}
        title="Italic"
      >
        <Italic className="size-3.5" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => onInsert('\n- list item')}
        title="Bullet List"
      >
        <List className="size-3.5" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => onInsert('\n1. first item')}
        title="Numbered List"
      >
        <ListOrdered className="size-3.5" />
      </Button>
    </div>
  );
}
