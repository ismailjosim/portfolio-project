import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Code2 } from 'lucide-react';

interface SkillIconProps {
  icon?: string;
  className?: string;
  size?: number;
}

const DARK_INVERT_PATTERNS = [
  'nextjs',
  'vercel',
  'github',
  'express',
  'linux',
  'socketio',
  'prisma',
  'bash',
  'apple',
  'flask',
  'electron',
];

export const SkillIcon: React.FC<SkillIconProps> = ({ icon, className = 'text-lg', size = 20 }) => {
  if (!icon) {
    return <Code2 className="shrink-0" size={size} />;
  }

  const lowerIcon = icon.toLowerCase();
  const needsDarkInvert = DARK_INVERT_PATTERNS.some((pattern) => lowerIcon.includes(pattern));
  const isPhotoshop = lowerIcon.includes('photoshop');

  const extraClasses = needsDarkInvert
    ? 'dark:brightness-0 dark:invert dark:opacity-95'
    : isPhotoshop
    ? 'dark:contrast-125 dark:brightness-125'
    : '';

  // 1. Devicon font classes (e.g. "devicon-react-original colored" or "devicon-javascript-plain")
  if (icon.startsWith('devicon-')) {
    return (
      <i
        className={`${icon} ${className} ${extraClasses} shrink-0 inline-flex items-center justify-center transition-all`}
        style={{ fontSize: `${size}px`, lineHeight: 1 }}
      />
    );
  }

  // 2. Image URL / Cloudinary / SVG upload
  if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/') || icon.startsWith('data:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt=""
        width={size}
        height={size}
        className="shrink-0 object-contain inline-block rounded-xs"
        style={{ width: size, height: size }}
      />
    );
  }

  // 3. Lucide icon name fallback
  const LucideComponent = (LucideIcons as unknown as Record<string, React.FC<{ size?: number; className?: string }>>)[icon];
  if (LucideComponent) {
    return <LucideComponent size={size} className="shrink-0" />;
  }

  // 4. Clean slug (e.g. "react" -> "devicon-react-original colored")
  const cleanSlug = icon.toLowerCase().trim();
  return (
    <i
      className={`devicon-${cleanSlug}-plain colored ${className} ${extraClasses} shrink-0 inline-flex items-center justify-center`}
      style={{ fontSize: `${size}px`, lineHeight: 1 }}
    />
  );
};

export default SkillIcon;
