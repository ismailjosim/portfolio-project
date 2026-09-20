import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { AppSidebar } from '@/src/components/app-sidebar';
import { Separator } from '@/src/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/src/components/ui/sidebar';
import { DynamicBreadcrumb } from '@/src/components/dashboard/DynamicBreadcrumb';
import ThemeToggle from '@/src/components/ui/ThemeToggle';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard — Admin Portal',
    template: '%s | Admin Dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0 max-w-full overflow-x-hidden">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 min-w-0">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-accent transition-colors"
              title="View Public Portfolio"
            >
              <span>Live Site</span>
              <ExternalLink className="size-3.5" />
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-4 max-w-full min-w-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
