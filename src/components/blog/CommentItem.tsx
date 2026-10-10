'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { formatDateTime } from '@/src/lib/formatters';
import type { CommentNode } from '@/src/lib/comment-tree';

interface CommentItemProps {
  comment: CommentNode;
  /** Nesting level; unlimited in the data, capped visually (see INDENT_LEVEL_CAP). */
  depth: number;
  onToggleLike: (commentId: string) => Promise<void> | void;
  onReply: (parentId: string, name: string, content: string) => Promise<boolean>;
}

// Replies can nest without limit, but the indent stops growing after a few levels so a
// deep thread stays readable on a phone instead of collapsing into a column of one word.
const INDENT_LEVEL_CAP = 5;

export default function CommentItem({ comment, depth, onToggleLike, onReply }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyName, setReplyName] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleToggleLike = async () => {
    setIsLiking(true);
    try {
      await onToggleLike(comment._id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitReply = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const posted = await onReply(comment._id, replyName, replyContent);

      if (posted) {
        setReplyName('');
        setReplyContent('');
        setIsReplying(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 shrink-0 rounded-full bg-muted flex items-center justify-center font-semibold">
        {comment.name[0]?.toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="bg-muted/50 rounded-xl px-4 py-2">
          <div className="flex justify-between items-center gap-3">
            <p className="font-semibold text-sm truncate">{comment.name}</p>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDateTime(comment.createdAt)}
            </span>
          </div>

          <p className="text-sm mt-1 whitespace-pre-wrap wrap-break-word">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 px-2">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLiking}
            aria-pressed={comment.likedByMe}
            className={`inline-flex items-center gap-1 transition-colors hover:text-foreground disabled:opacity-60 ${
              comment.likedByMe ? 'text-red-500' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${comment.likedByMe ? 'fill-current' : ''}`} />
            {comment.likedByMe ? 'Liked' : 'Like'}
            {comment.likesCount > 0 && <span className="font-medium">{comment.likesCount}</span>}
          </button>

          <button
            type="button"
            onClick={() => setIsReplying((open) => !open)}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Reply
          </button>

          {comment.replies.length > 0 && (
            <span>
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>

        {/* Reply composer */}
        {isReplying && (
          <form onSubmit={handleSubmitReply} className="mt-3 space-y-2">
            <input
              value={replyName}
              onChange={(event) => setReplyName(event.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-1.5 text-sm rounded-md border bg-background"
            />

            <textarea
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
              placeholder={`Reply to ${comment.name}...`}
              rows={2}
              className="w-full px-3 py-1.5 text-sm rounded-md border bg-background resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-3 py-1.5 text-xs rounded-md border hover:bg-muted transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-3 w-3" />
                {isSubmitting ? 'Replying...' : 'Reply'}
              </button>
            </div>
          </form>
        )}

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div
            className={`mt-4 space-y-4 ${
              depth < INDENT_LEVEL_CAP ? 'border-l border-border pl-3 sm:pl-6' : ''
            }`}
          >
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                depth={depth + 1}
                onToggleLike={onToggleLike}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
