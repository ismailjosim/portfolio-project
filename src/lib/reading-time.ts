export function calculateReadingTime(text?: string): string {
  if (!text) return '1 min read';
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
