'use client';

import { useEffect, useState } from 'react';

export default function BlogReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(3)) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollCompletion, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollCompletion);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}
