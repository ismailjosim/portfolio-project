'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StatCards } from '@/src/components/newsletter/StatCards';
import { SubscriberTable } from '@/src/components/newsletter/SubscriberTable';
import { BlockedEmailsTable } from '@/src/components/newsletter/BlockedEmailsTable';
import { SendNewsletterDialog } from '@/src/components/newsletter/SendNewsletterDialog';
import { BlockEmailDialog } from '@/src/components/newsletter/BlockEmailDialog';
import { Stats, Subscriber, BlockedEmail } from '@/src/types/newsletter.interface';

interface NewsletterDashboardProps {
  stats: Stats;
  recentSubscribers: Subscriber[];
}

export default function NewsletterDashboard({
  stats,
  recentSubscribers,
}: NewsletterDashboardProps) {
  const [blockedEmails, setBlockedEmails] = useState<BlockedEmail[]>([]);
  const [selectedBlockEmail, setSelectedBlockEmail] = useState('');
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Trigger a re-fetch without calling setState synchronously in an effect
  const refetchBlockedEmails = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    let ignore = false;

    async function loadBlockedEmails() {
      try {
        const res = await fetch('/api/newsletter/block');
        const data = await res.json();

        // Ensure state update only occurs asynchronously and if component is mounted
        if (!ignore) {
          if (data.success) {
            setBlockedEmails(data.data);
          } else {
            toast.error(data.message || 'Failed to load blocked emails');
          }
        }
      } catch {
        if (!ignore) {
          toast.error('Network error while loading blocked emails');
        }
      }
    }

    loadBlockedEmails();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleUnblockEmail = async (email: string) => {
    try {
      const res = await fetch(`/api/newsletter/block?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        refetchBlockedEmails();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to unblock email');
    }
  };

  const handleOpenBlockDialog = (email: string) => {
    setSelectedBlockEmail(email);
    setIsBlockDialogOpen(true);
  };

  const combinedStats: Stats = {
    ...stats,
    blockedCount: blockedEmails.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Newsletter Subscribers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your newsletter audience and monitor subscriptions.
          </p>
        </div>
        <SendNewsletterDialog />
      </div>

      <StatCards stats={combinedStats} />

      <SubscriberTable subscribers={recentSubscribers} onInitiateBlock={handleOpenBlockDialog} />

      <BlockedEmailsTable blockedEmails={blockedEmails} onUnblock={handleUnblockEmail} />

      <BlockEmailDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        initialEmail={selectedBlockEmail}
        onSuccess={refetchBlockedEmails}
      />
    </div>
  );
}
