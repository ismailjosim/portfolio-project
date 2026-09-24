'use client';

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import SkillIcon from '@/src/components/shared/SkillIcon';
import { uploadImage, deleteImageAction } from '@/src/services/upload.action';
import { toast } from 'sonner';
import { isImageUrl } from './TechPresetTab';

export interface CustomIconItem {
  _id?: string;
  name: string;
  url: string;
  category?: string;
}

const LOCAL_STORAGE_KEY = 'custom_skill_icons_cache';

interface CustomIconTabProps {
  customIcons: CustomIconItem[];
  setCustomIcons: React.Dispatch<React.SetStateAction<CustomIconItem[]>>;
  selectedValue: string;
  skillName?: string;
  onSelectIcon: (url: string, name?: string, category?: string) => void;
  onClosePopover: () => void;
}

export const CustomIconTab: React.FC<CustomIconTabProps> = ({
  customIcons,
  setCustomIcons,
  selectedValue,
  skillName,
  onSelectIcon,
  onClosePopover,
}) => {
  const [customName, setCustomName] = useState('');
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [tempUploadedUrl, setTempUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previousUpload = tempUploadedUrl;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'skill_icons');
      const res = await uploadImage(formData, 'skill_icons');

      if (res.success && res.url) {
        setCustomLogoUrl(res.url);
        setTempUploadedUrl(res.url);
        toast.success('Logo uploaded');

        if (
          previousUpload &&
          previousUpload.includes('cloudinary.com') &&
          previousUpload !== res.url
        ) {
          deleteImageAction(previousUpload).catch(console.error);
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        setCustomLogoUrl(localUrl);
        toast.info('Using local preview');
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setCustomLogoUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyCustom = async () => {
    if (!customLogoUrl && !customName.trim()) {
      toast.error('Please upload a logo or enter an icon name');
      return;
    }

    const finalName = customName.trim() || skillName || 'Custom Icon';
    const iconVal = customLogoUrl || customName.trim();

    onSelectIcon(iconVal, finalName);
    onClosePopover();

    if (isImageUrl(iconVal)) {
      const newItem: CustomIconItem = {
        name: finalName,
        url: iconVal,
        category: 'frontend',
      };

      setCustomIcons((prev) => {
        const filtered = prev.filter((i) => i.url !== iconVal);
        const updated = [newItem, ...filtered];
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
        return updated;
      });

      try {
        await fetch('/api/custom-icons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        toast.success('Added to Skill Icons Library');
      } catch (err) {
        console.error('Failed to persist custom icon:', err);
      }
    }

    setCustomName('');
    setCustomLogoUrl('');
  };

  const handleDeleteCustomIcon = async (e: React.MouseEvent, item: CustomIconItem) => {
    e.stopPropagation();
    try {
      setCustomIcons((prev) => {
        const updated = prev.filter((i) => i.url !== item.url);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
        return updated;
      });

      await fetch(`/api/custom-icons?url=${encodeURIComponent(item.url)}`, {
        method: 'DELETE',
      });

      if (selectedValue === item.url) {
        onSelectIcon('');
      }

      toast.success(`Removed "${item.name}" from library`);
    } catch (err) {
      console.error('Failed to delete custom icon:', err);
      toast.error('Failed to remove icon');
    }
  };

  return (
    <div className="p-3 space-y-3 max-h-70 overflow-y-auto scrollbar-thin">
      <div>
        <label className="text-[11px] font-medium text-foreground mb-1 block">
          Skill / Logo Name
        </label>
        <Input
          placeholder="e.g. next-themes, Apollo Client..."
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="h-8 text-xs bg-background"
        />
      </div>

      <div>
        <label className="text-[11px] font-medium text-foreground mb-1 block">
          Upload Custom Logo (PNG / SVG / WebP)
        </label>
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-dashed border-border bg-muted/20">
          <div className="flex items-center gap-2.5 truncate min-w-0">
            {customLogoUrl ? (
              <div className="w-7 h-7 rounded-md bg-muted/60 border border-border flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                <SkillIcon icon={customLogoUrl} size={22} className="text-base object-contain" />
              </div>
            ) : (
              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-xs text-muted-foreground truncate">
              {customLogoUrl ? 'Logo uploaded & ready' : 'PNG, SVG, WebP, JPEG'}
            </span>
          </div>

          <input
            type="file"
            accept="image/png,image/svg+xml,image/jpeg,image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-7 text-xs font-medium px-2.5 cursor-pointer shrink-0"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Upload className="h-3.5 w-3.5 mr-1.5" />
            )}
            {customLogoUrl ? 'Change' : 'Upload'}
          </Button>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={handleApplyCustom}
        disabled={!customLogoUrl && !customName.trim()}
        className="h-8 text-xs font-semibold px-3 w-full cursor-pointer"
      >
        Add to Skill & Save to Library
      </Button>

      {/* Saved Custom Icons Library Shelf */}
      {customIcons.length > 0 && (
        <div className="pt-2 border-t border-border/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Custom Icons Library ({customIcons.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto scrollbar-thin">
            {customIcons.map((item) => {
              const isSelected = selectedValue === item.url;
              return (
                <div
                  key={item._id || item.url}
                  role="button"
                  onClick={() => {
                    onSelectIcon(item.url, item.name, item.category);
                    onClosePopover();
                  }}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-medium transition-all cursor-pointer group select-none ${
                    isSelected
                      ? 'border-primary bg-primary/15 text-primary font-semibold ring-1 ring-primary/30'
                      : 'border-border/70 bg-card hover:border-primary/40 hover:bg-muted/60 text-foreground'
                  }`}
                >
                  <SkillIcon icon={item.url} size={13} className="shrink-0 object-contain" />
                  <span className="truncate max-w-28">{item.name}</span>
                  <span
                    role="button"
                    onClick={(e) => handleDeleteCustomIcon(e, item)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive rounded-full transition-opacity cursor-pointer ml-0.5"
                    title="Delete icon from library"
                  >
                    <Trash2 size={10} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomIconTab;
