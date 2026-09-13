'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { buildCommentTree, countCommentNodes, type FlatComment } from '@/src/lib/comment-tree';
import { CommentsSkeleton, EmptyState } from '../shared/PublicDataSkeletons';
import CommentItem from './CommentItem';

interface BlogCommentsSectionProps {
  slug: string;
  initialCommentsCount: number;
  initialLikesCount: number;
}

export default function BlogCommentsSection({
  initialCommentsCount,
  initialLikesCount,
  slug,
}: BlogCommentsSectionProps) {
  const [comments, setComments] = useState<FlatComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The API returns a flat list; the nesting is derived here so replies can be inserted
  // locally without refetching the whole thread.
  const tree = useMemo(() => buildCommentTree(comments), [comments]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}/comments`, {
        cache: 'no-store',
      });

      const data = await res.json();
      const loaded: FlatComment[] = data.comments || [];

      setComments(loaded);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const load = async () => {
      await fetchComments();
    };
    load();
  }, [fetchComments]);

  const postComment = useCallback(
    async (author: string, body: string, parentId?: string) => {
      if (!author.trim() || !body.trim()) {
        toast.error(parentId ? 'Add your name and a reply' : 'Fill all fields');
        return false;
      }

      try {
        const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: author, content: body, parentId }),
        });

        const posted = await res.json();

        if (!res.ok) {
          throw new Error(posted.error || 'Failed to post comment');
        }

        setComments((current) => [posted, ...current]);

        toast.success(parentId ? 'Reply posted' : 'Comment posted');
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed');
        return false;
      }
    },
    [slug]
  );

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const posted = await postComment(name, content);

      if (posted) {
        setName('');
        setContent('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = useCallback(
    (parentId: string, author: string, body: string) => postComment(author, body, parentId),
    [postComment]
  );

  const handleToggleLike = useCallback(
    async (commentId: string) => {
      // Flip locally first so the heart responds immediately, then reconcile with the
      // authoritative count from the server (or roll back on failure).
      const rollback = (current: FlatComment[]) =>
        current.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likedByMe: !comment.likedByMe,
                likesCount: Math.max(0, (comment.likesCount ?? 0) + (comment.likedByMe ? -1 : 1)),
              }
            : comment
        );

      setComments(rollback);

      try {
        const res = await fetch(
          `/api/blogs/${encodeURIComponent(slug)}/comments/${commentId}/likes`,
          { method: 'PATCH' }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to update like');
        }

        setComments((current) =>
          current.map((comment) =>
            comment._id === commentId
              ? { ...comment, likedByMe: data.isLiked, likesCount: data.likesCount }
              : comment
          )
        );
      } catch (error) {
        setComments(rollback);
        toast.error(error instanceof Error ? error.message : 'Failed to update like');
      }
    },
    [slug]
  );

  // Show the server-rendered count until the thread arrives, so the header does not
  // flash "0 comments" on first paint.
  const visibleCount = loading ? initialCommentsCount : countCommentNodes(tree);

  return (
    <section className="max-w-3xl mx-auto mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments
        </h2>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            {initialLikesCount}
          </span>
          <span>
            {visibleCount} {visibleCount === 1 ? 'comment' : 'comments'}
          </span>
        </div>
      </div>

      {/* Input box (Facebook style) */}
      <form onSubmit={handleSubmitComment} className="flex gap-3 mb-8">
        <div className="w-10 h-10 shrink-0 rounded-full bg-muted flex items-center justify-center font-semibold">
          {name?.[0]?.toUpperCase() || 'U'}
        </div>

        <div className="flex-1">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="w-full mb-2 px-3 py-2 rounded-md border bg-background"
          />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className="w-full px-3 py-2 rounded-md border bg-background resize-none"
          />

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {loading ? (
          <CommentsSkeleton />
        ) : tree.length === 0 ? (
          <EmptyState
            icon="comments"
            title="No comments yet"
            description="Be the first to share a thought on this article."
          />
        ) : (
          tree.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              depth={0}
              onToggleLike={handleToggleLike}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </section>
  );
}
