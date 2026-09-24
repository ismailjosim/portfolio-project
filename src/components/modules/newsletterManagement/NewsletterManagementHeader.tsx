'use client';

import { FileText, Send, Shield, Users } from 'lucide-react';
import ManagementPageHeader from '../../shared/ManagementPageHeader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '../../ui/button';
import { SendNewsletterDialog } from '../../newsletter/SendNewsletterDialog';
import { BlockEmailDialog } from '../../newsletter/BlockEmailDialog';

interface NewsletterManagementHeaderProps {
  currentTab?: 'subscribers' | 'templates';
  templateCount?: number;
  subscriberCount?: number;
}

const NewsletterManagementHeader = ({
  currentTab: propTab,
  templateCount,
}: NewsletterManagementHeaderProps = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  const activeTab =
    propTab || (searchParams.get('tab') === 'templates' ? 'templates' : 'subscribers');
  const isTemplates = activeTab === 'templates';

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleToggleTable = () => {
    const params = new URLSearchParams(searchParams.toString());
    const targetTab = isTemplates ? 'subscribers' : 'templates';

    if (targetTab === 'subscribers') {
      params.delete('tab');
    } else {
      params.set('tab', 'templates');
    }
    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const title = isTemplates ? 'Newsletter Templates' : 'Newsletter Subscribers';
  const description = isTemplates
    ? 'Archive of sent broadcasts saved as reusable templates. Copy content or broadcast again.'
    : 'Manage audience, monitor subscriber growth, and broadcast newsletters.';

  return (
    <>
      <SendNewsletterDialog
        open={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
        onSuccess={handleRefresh}
      />

      <BlockEmailDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        initialEmail=""
        onSuccess={handleRefresh}
      />

      <ManagementPageHeader
        title={title}
        description={description}
        action={{
          label: 'Send Newsletter',
          icon: Send,
          onClick: () => setIsSendDialogOpen(true),
        }}
      >
        {/* Toggle between Subscribers and Templates Table */}
        <Button
          variant={isTemplates ? 'secondary' : 'outline'}
          onClick={handleToggleTable}
          className="w-full sm:w-auto shrink-0 shadow-sm gap-2"
        >
          {isTemplates ? (
            <>
              <Users className="h-4 w-4 text-primary" />
              <span>Subscribers Table</span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 text-primary" />
              <span>Templates Table</span>
              {templateCount !== undefined && templateCount > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {templateCount}
                </span>
              )}
            </>
          )}
        </Button>

        {!isTemplates && (
          <Button
            variant="outline"
            onClick={() => setIsBlockDialogOpen(true)}
            className="w-full sm:w-auto shrink-0 shadow-sm"
          >
            <Shield className="mr-2 h-4 w-4" />
            Block Email
          </Button>
        )}
      </ManagementPageHeader>
    </>
  );
};

export default NewsletterManagementHeader;
