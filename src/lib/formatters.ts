export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDateTime(date?: string | Date | null): string {
  if (!date) return 'N/A';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return 'Invalid date';

  return parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a date into a human-friendly relative time string (e.g., "5 minutes ago", "yesterday", "in 2 days")
 * using standard Native Intl.RelativeTimeFormat (Zero extra dependencies).
 */
export function formatRelativeTime(date?: string | Date | null): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '';

  const now = Date.now();
  const diffInSeconds = Math.round((parsed.getTime() - now) / 1000);

  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ];

  const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(diffInSeconds));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  return rtf.format(Math.round(diffInSeconds / divisor), units[unitIndex]);
}

/**
 * Formats an object into a URL search query string using native URLSearchParams.
 */
export function queryStringFormatter(
  searchParamsObj: Record<string, string | string[] | undefined>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParamsObj)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined) params.append(key, item);
      }
    } else {
      params.set(key, value);
    }
  }

  return params.toString();
}
