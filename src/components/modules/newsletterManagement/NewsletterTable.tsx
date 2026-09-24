'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Shield, ShieldCheck, UserCheck, UserMinus } from 'lucide-react';
import { Subscriber } from '@/src/types/newsletter.interface';
import ManagementTable from '../../shared/ManagementTable';
import DeleteConfirmationDialog from '../../shared/DeleteConfirmationDialog';
import { DropdownMenuItem } from '../../ui/dropdown-menu';
import { newsletterColumns } from './newsletterColumns';
import { SubscriberViewDetailDialog } from './SubscriberViewDetailDialog';
import { BlockEmailDialog } from '../../newsletter/BlockEmailDialog';

interface NewsletterTableProps {
  subscribers: Subscriber[];
}

export function NewsletterTable({ subscribers }: NewsletterTableProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const [viewingSubscriber, setViewingSubscriber] = useState<Subscriber | null>(null);
  const [deletingSubscriber, setDeletingSubscriber] = useState<Subscriber | null>(null);
  const [blockingEmail, setBlockingEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (sub: Subscriber) => {
    setViewingSubscriber(sub);
  };

  const handleDelete = (sub: Subscriber) => {
    setDeletingSubscriber(sub);
  };

  const confirmDelete = async () => {
    if (!deletingSubscriber) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/newsletter/subscribers?id=${deletingSubscriber._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Subscriber deleted successfully');
        setDeletingSubscriber(null);
        if (viewingSubscriber?._id === deletingSubscriber._id) {
          setViewingSubscriber(null);
        }
        handleRefresh();
      } else {
        toast.error(data.message || 'Failed to delete subscriber');
      }
    } catch {
      toast.error('Failed to delete subscriber');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (sub: Subscriber) => {
    try {
      const res = await fetch('/api/newsletter/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sub._id,
          email: sub.email,
          isActive: !sub.isActive,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Subscriber ${sub.email} marked as ${!sub.isActive ? 'active' : 'inactive'}`);
        handleRefresh();
      } else {
        toast.error(data.message || 'Failed to update subscriber');
      }
    } catch {
      toast.error('Failed to update subscriber status');
    }
  };

  const handleUnblock = async (email: string) => {
    try {
      const res = await fetch(`/api/newsletter/block?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Email unblocked successfully');
        handleRefresh();
      } else {
        toast.error(data.message || 'Failed to unblock email');
      }
    } catch {
      toast.error('Failed to unblock email');
    }
  };

  return (
    <>
      <ManagementTable
        data={subscribers}
        columns={newsletterColumns}
        onView={handleView}
        onDelete={handleDelete}
        getRowKey={(sub) => sub._id}
        emptyMessage="No subscribers found"
        isRefreshing={isRefreshing}
        rowClassName={(sub) =>
          sub.status === 'blocked' ? 'bg-amber-500/5 dark:bg-amber-950/10' : undefined
        }
        extraActions={(sub) => {
          const isBlocked = sub.status === 'blocked' || sub.isBlocked;
          return (
            <>
              {isBlocked ? (
                <DropdownMenuItem
                  onClick={() => handleUnblock(sub.email)}
                  className="text-emerald-600 focus:text-emerald-700"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Unblock Email
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => setBlockingEmail(sub.email)}
                  className="text-amber-600 focus:text-amber-700"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Block Email
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => handleToggleStatus(sub)}>
                {sub.isActive ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Reactivate
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => window.open(`mailto:${sub.email}`)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Direct Email
              </DropdownMenuItem>
            </>
          );
        }}
      />

      {/* View Subscriber Detail Dialog */}
      <SubscriberViewDetailDialog
        open={!!viewingSubscriber}
        onClose={() => setViewingSubscriber(null)}
        subscriber={viewingSubscriber}
        onInitiateBlock={(email) => {
          setViewingSubscriber(null);
          setBlockingEmail(email);
        }}
        onInitiateUnblock={(email) => {
          handleUnblock(email);
          setViewingSubscriber(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingSubscriber}
        onOpenChange={(open) => !open && setDeletingSubscriber(null)}
        onConfirm={confirmDelete}
        title="Delete Subscriber"
        description={`Are you sure you want to permanently remove "${deletingSubscriber?.email}" from the newsletter list? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      {/* Block Email Dialog */}
      <BlockEmailDialog
        open={!!blockingEmail}
        onOpenChange={(open) => !open && setBlockingEmail(null)}
        initialEmail={blockingEmail || ''}
        onSuccess={() => {
          setBlockingEmail(null);
          handleRefresh();
        }}
      />
    </>
  );
}

export default NewsletterTable;
