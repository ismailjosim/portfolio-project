'use client';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
);

interface Props {
  content: string;
}

export default function MarkdownPreview({ content }: Props) {
  const { resolvedTheme } = useTheme();

  return (
    <div data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}>
      <MDPreview
        source={content}
        style={{
          background: 'transparent',
          color: 'inherit',
          fontSize: '1rem',
        }}
      />
    </div>
  );
}
