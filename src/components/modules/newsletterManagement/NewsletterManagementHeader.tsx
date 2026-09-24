'use client';

import { Send, Shield } from 'lucide-react';
import ManagementPageHeader from '../../shared/ManagementPageHeader';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '../../ui/button';
import { SendNewsletterDialog } from '../../newsletter/SendNewsletterDialog';
import { BlockEmailDialog } from '../../newsletter/BlockEmailDialog';

const NewsletterManagementHeader = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <SendNewsletterDialog
        open={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
      />

      <BlockEmailDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        initialEmail=""
        onSuccess={handleRefresh}
      />

      <ManagementPageHeader
        title="Newsletter Subscribers"
        description="Manage audience, monitor subscriber growth, and broadcast newsletters."
        action={{
          label: 'Send Newsletter',
          icon: Send,
          onClick: () => setIsSendDialogOpen(true),
        }}
      >
        <Button
          variant="outline"
          onClick={() => setIsBlockDialogOpen(true)}
          className="w-full sm:w-auto shrink-0 shadow-sm"
        >
          <Shield className="mr-2 h-4 w-4" />
          Block Email
        </Button>
      </ManagementPageHeader>
    </>
  );
};

export default NewsletterManagementHeader;
