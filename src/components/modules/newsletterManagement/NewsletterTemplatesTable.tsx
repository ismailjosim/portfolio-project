'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Copy, Eye, Send } from 'lucide-react';
import { NewsletterTemplateItem } from '@/src/types/newsletter.interface';
import ManagementTable from '../../shared/ManagementTable';
import DeleteConfirmationDialog from '../../shared/DeleteConfirmationDialog';
import { DropdownMenuItem } from '../../ui/dropdown-menu';
import { newsletterTemplateColumns } from './newsletterTemplateColumns';
import { NewsletterTemplatePreviewDialog } from './NewsletterTemplatePreviewDialog';
import { SendNewsletterDialog } from '../../newsletter/SendNewsletterDialog';

interface NewsletterTemplatesTableProps {
  templates: NewsletterTemplateItem[];
}

export function NewsletterTemplatesTable({ templates }: NewsletterTemplatesTableProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const [previewingTemplate, setPreviewingTemplate] = useState<NewsletterTemplateItem | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<NewsletterTemplateItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State to launch SendNewsletterDialog with pre-filled content
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedTemplateForSend, setSelectedTemplateForSend] =
    useState<NewsletterTemplateItem | null>(null);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleCopyContent = async (template: NewsletterTemplateItem) => {
    try {
      await navigator.clipboard.writeText(template.content);
      toast.success(`Copied "${template.subject}" content to clipboard! 📋`);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleUseTemplate = (template: NewsletterTemplateItem) => {
    setSelectedTemplateForSend(template);
    setIsSendDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTemplate) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/newsletter/templates?id=${deletingTemplate._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Template deleted successfully');
        setDeletingTemplate(null);
        if (previewingTemplate?._id === deletingTemplate._id) {
          setPreviewingTemplate(null);
        }
        handleRefresh();
      } else {
        toast.error(data.message || 'Failed to delete template');
      }
    } catch {
      toast.error('Failed to delete template');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ManagementTable
        data={templates}
        columns={newsletterTemplateColumns}
        onView={(t) => setPreviewingTemplate(t)}
        onDelete={(t) => setDeletingTemplate(t)}
        getRowKey={(t) => t._id}
        emptyMessage="No saved templates found. Broadcast emails will automatically be saved here as reusable templates."
        isRefreshing={isRefreshing}
        extraActions={(template) => (
          <>
            <DropdownMenuItem
              onClick={() => handleUseTemplate(template)}
              className="text-primary focus:text-primary font-medium"
            >
              <Send className="mr-2 h-4 w-4" />
              Use as Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopyContent(template)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Content
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPreviewingTemplate(template)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview Template
            </DropdownMenuItem>
          </>
        )}
      />

      {/* Preview Dialog */}
      <NewsletterTemplatePreviewDialog
        open={!!previewingTemplate}
        onOpenChange={(open) => !open && setPreviewingTemplate(null)}
        template={previewingTemplate}
        onUseTemplate={handleUseTemplate}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingTemplate}
        onOpenChange={(open) => !open && setDeletingTemplate(null)}
        onConfirm={confirmDelete}
        title="Delete Template"
        description={`Are you sure you want to permanently delete the template "${deletingTemplate?.subject}"? This cannot be undone.`}
        isDeleting={isDeleting}
      />

      {/* Send Dialog prefilled when "Use as Template" is triggered */}
      {isSendDialogOpen && (
        <SendNewsletterDialog
          open={isSendDialogOpen}
          onOpenChange={(open) => {
            setIsSendDialogOpen(open);
            if (!open) setSelectedTemplateForSend(null);
          }}
          initialSubject={selectedTemplateForSend?.subject || ''}
          initialContent={selectedTemplateForSend?.content || ''}
          onSuccess={handleRefresh}
        />
      )}
    </>
  );
}

export default NewsletterTemplatesTable;
