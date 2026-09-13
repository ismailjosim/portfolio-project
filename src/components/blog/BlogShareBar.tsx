'use client';

import { Share2, Check, Copy, Twitter, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/src/components/ui/button';

interface BlogShareBarProps {
  title: string;
  slug: string;
}

export default function BlogShareBar({ title, slug }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blogs/${slug}`;
    }
    return `https://www.ismailjosim.com/blogs/${slug}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleTwitterShare = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(`Check out "${title}" by @ismail_josim:\n${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-4 border-y border-border/60 my-8">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mr-2">
        <Share2 className="w-3.5 h-3.5 text-primary" />
        Share this article:
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
        className="h-8 gap-1.5 text-xs hover:text-[#1DA1F2] hover:border-[#1DA1F2]"
      >
        <Twitter className="w-3.5 h-3.5" />
        Twitter / X
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleLinkedInShare}
        className="h-8 gap-1.5 text-xs hover:text-[#0A66C2] hover:border-[#0A66C2]"
      >
        <Linkedin className="w-3.5 h-3.5" />
        LinkedIn
      </Button>

      <Button variant="outline" size="sm" onClick={handleCopyLink} className="h-8 gap-1.5 text-xs">
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  );
}
