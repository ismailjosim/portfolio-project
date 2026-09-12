// sidebar-profile.tsx
'use client';

import Image from 'next/image';
import SocialIcons from './SocialIcons';
import ThemeToggle from '../ui/ThemeToggle';

export function SidebarProfile() {
  return (
    <div className="relative z-10 p-6 text-center border-b border-border transition-all duration-300 group-data-[collapsible=icon]:hidden">
      <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-primary">
        <Image
          src="/person.jpeg"
          alt="Jasim"
          width={500}
          height={500}
          loading="eager"
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-bold text-base">Md. Jasim</h3>
      <p className="text-xs text-accent mt-1">Full Stack Developer</p>

      <div className="flex justify-center gap-2 mt-3">
        <SocialIcons.Phone />
        <SocialIcons.Email />
        <SocialIcons.WhatsApp />
        <ThemeToggle />
      </div>
    </div>
  );
}
