import { LucideIcon, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import React from 'react';

interface ManagementPageHeaderPros {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

const ManagementPageHeader = ({
  title,
  description,
  action,
  children,
}: ManagementPageHeaderPros) => {
  const Icon = action?.icon || Plus;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm sm:text-base text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button onClick={action?.onClick} className="w-full sm:w-auto shrink-0 shadow-sm">
          <Icon className="mr-2 h-4 w-4" />
          {action?.label}
        </Button>
      )}
      {children}
    </div>
  );
};

export default ManagementPageHeader;
