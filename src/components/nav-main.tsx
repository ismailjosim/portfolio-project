'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/src/components/ui/sidebar';

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="p-2">
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {items.map((item) => {
            const fullPath = `/dashboard${item.url}`;
            const isActive = pathname === fullPath || pathname.startsWith(fullPath + '/');

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  size="default"
                  className={cn(
                    'cursor-pointer rounded-lg transition-all duration-200 font-medium',
                    'group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Link
                    href={fullPath}
                    className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
