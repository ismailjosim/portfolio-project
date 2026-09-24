'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/src/components/ui/breadcrumb';

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  overview: 'Overview',
  blog: 'Blog',
  blogs: 'Blogs',
  projects: 'Projects',
  skills: 'Skills',
  experiences: 'Experiences',
  newsletter: 'Newsletter',
  'blog-editor': 'Blog Editor',
  analytics: 'Analytics',
  settings: 'Settings',
};

export const DynamicBreadcrumb = () => {
  const pathname = usePathname();

  // Parse the pathname to get breadcrumb items
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== 'dashboard');

  // Build breadcrumb items
  const breadcrumbItems: { label: string; href: string; isActive: boolean }[] = [];

  let currentPath = '/dashboard';
  breadcrumbItems.push({
    label: 'Dashboard',
    href: currentPath,
    isActive: segments.length === 0,
  });

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    breadcrumbItems.push({
      label: breadcrumbLabels[segment] || formatSegment(segment),
      href: currentPath,
      isActive: isLast,
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem className={item.isActive ? 'block' : 'hidden md:block'}>
              {item.isActive ? (
                <BreadcrumbPage className="font-semibold text-foreground truncate max-w-40 sm:max-w-none">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className="truncate max-w-30 sm:max-w-none">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
