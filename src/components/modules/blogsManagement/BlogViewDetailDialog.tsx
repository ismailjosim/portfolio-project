'use client';
import { useState } from 'react';
import {
  BarChart2,
  BookOpen,
  Calendar,
  Heart,
  Link,
  MessageCircle,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { IBlog } from '../../../types/blog.interface';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Badge } from '../../ui/badge';
import InfoRow from '../../shared/InfoRow';
import { Separator } from '../../ui/separator';
import { Button } from '../../ui/button';
import { formatDateTime } from '../../../lib/formatters.ts';
import { useTheme } from 'next-themes';

// Dynamically import MDEditor preview to avoid SSR issues
const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
);

interface IBlogViewDialogProps {
  open: boolean;
  onClose: () => void;
  blog: IBlog | null;
}

const BlogViewDetailDialog = ({ open, onClose, blog }: IBlogViewDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  if (!blog) return null;

  const blogUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/blogs/${blog.slug}` : '';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-none! w-11/12 md:w-4/5 max-h-[90vh] flex flex-col px-px py-5 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Blog Details</DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-2 pb-6">
          {/* Blog Header */}
          <div className="flex flex-col gap-4 p-5 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg mb-6">
            {blog.coverImage && (
              <Image
                src={blog.coverImage}
                alt={blog.title}
                width={1200}
                height={300}
                className="w-full h-48 rounded-lg object-cover border-4 border-white shadow-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                <h2 className="text-xl font-bold wrap-break-word">{blog.title}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="shrink-0 flex items-center gap-1.5 whitespace-nowrap"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copied URL' : 'Copy Blog URL'}
                </Button>
              </div>
              <p className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>{blog.category}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Engagement Stats */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-lg">Engagement</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <BarChart2 className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Views" value={String(blog.views)} />
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Likes" value={String(blog.likesCount)} />
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Comments" value={String(blog.commentsCount)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Post Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Post Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                  <Link className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Blog URL</p>
                    <a
                      href={blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline break-all"
                    >
                      {blogUrl}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Slug" value={blog.slug} />
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Category" value={blog.category} />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Created On" value={formatDateTime(blog.createdAt as string)} />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                  <InfoRow label="Last Updated" value={formatDateTime(blog.updatedAt as string)} />
                </div>
              </div>
            </div>

            {/* Content */}
            {blog.content && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">Content</h3>
                  </div>
                  <div
                    className="bg-muted/50 p-4 rounded-lg"
                    data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
                  >
                    <MDPreview
                      source={blog.content}
                      style={{
                        background: 'transparent',
                        color: 'inherit',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogViewDetailDialog;
