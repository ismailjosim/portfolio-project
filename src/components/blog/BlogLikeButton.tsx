'use client';

import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BlogLikeButtonProps {
  blogId: string;
  initialCount: number;
  slug: string;
}

export default function BlogLikeButton({ initialCount, slug }: BlogLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  // Loading state for like request
  const [isLoading, setIsLoading] = useState(false);

  // Loading state for checking existing like
  const [isCheckingLike, setIsCheckingLike] = useState(true);

  // Check whether visitor already liked this blog
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        setIsCheckingLike(true);

        const response = await fetch(`/api/blogs/${encodeURIComponent(slug)}/likes`, {
          method: 'GET',
          cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check like status');
        }

        setIsLiked(data.isLiked);
        setCount(data.likesCount);
      } catch (error) {
        console.error('Failed to check like status:', error);
      } finally {
        setIsCheckingLike(false);
      }
    };

    checkLikeStatus();
  }, [slug]);

  const handleLike = async () => {
    if (isLiked) {
      toast.info('You already liked this post');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/blogs/${encodeURIComponent(slug)}/likes`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to like blog');
      }

      setIsLiked(true);

      // Use count returned from backend
      setCount(data.likesCount);

      toast.success('Blog liked!');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'You already liked this blog') {
          setIsLiked(true);
          toast.info(error.message);
        } else {
          toast.error(error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isCheckingLike || isLoading || isLiked;

  return (
    <button
      onClick={handleLike}
      disabled={isDisabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        isLiked
          ? 'bg-red-500/10 border-red-500/30 text-red-500'
          : 'hover:bg-accent/10 hover:border-accent'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isCheckingLike || isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Heart className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current' : ''}`} />
      )}

      <span>
        {count} {count === 1 ? 'like' : 'likes'}
      </span>
    </button>
  );
}
