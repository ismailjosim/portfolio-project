import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiences Management',
  description: 'Manage professional career history, employment milestones, and key achievements.',
};

const ExperiencesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Experiences Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage career history, employment periods, and achievements.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Experience management interface is coming soon.
      </div>
    </div>
  );
};

export default ExperiencesPage;
