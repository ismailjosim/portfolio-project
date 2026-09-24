'use client';

import { Smile } from 'lucide-react';

const QUICK_EMOJIS = [
  '✌️',
  '🚀',
  '🎉',
  '🔥',
  '💡',
  '💻',
  '✨',
  '📌',
  '👍',
  '❤️',
  '😎',
  '📩',
  '🎯',
  '⚡',
];

interface NewsletterEmojiBarProps {
  onSelectEmoji: (emoji: string) => void;
}

export function NewsletterEmojiBar({ onSelectEmoji }: NewsletterEmojiBarProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 rounded-lg bg-muted/40 border border-border/50">
      <span className="text-xs text-muted-foreground flex items-center gap-1 px-1.5 shrink-0 font-medium">
        <Smile className="size-3.5" />
        Quick:
      </span>
      <div className="flex items-center gap-1">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelectEmoji(emoji)}
            className="size-7 rounded hover:bg-muted text-sm flex items-center justify-center transition-colors cursor-pointer"
            title={`Insert ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
