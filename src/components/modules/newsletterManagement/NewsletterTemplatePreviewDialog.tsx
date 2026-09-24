'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, Copy, Check, Send, Calendar, Users, Code, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { NewsletterTemplateItem } from '@/src/types/newsletter.interface';
import { compileNewsletterToHtml } from '@/src/lib/newsletter-compiler';

interface NewsletterTemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: NewsletterTemplateItem | null;
  onUseTemplate: (template: NewsletterTemplateItem) => void;
}

export function NewsletterTemplatePreviewDialog({
  open,
  onOpenChange,
  template,
  onUseTemplate,
}: NewsletterTemplatePreviewDialogProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');

  if (!template) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopied(true);
      toast.success('Template content copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const previewHtml =
    template.html ||
    compileNewsletterToHtml(template.content, {
      subject: template.subject,
      senderName: 'Ismail Josim',
      unsubscribeUrl: '#unsubscribe',
      subscriberName: 'John',
    });

  const formattedDate = new Date(template.sentAt || template.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl w-[96vw] h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-card">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/60 shrink-0 bg-card">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="flex items-center gap-2 text-lg font-bold truncate">
                <FileText className="size-5 text-primary shrink-0" />
                <span className="truncate">{template.subject}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  Sent {formattedDate}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" />
                  {template.recipientCount}{' '}
                  {template.recipientCount === 1 ? 'recipient' : 'recipients'}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'preview' | 'source')}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="px-6 py-2.5 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <TabsList className="h-8 bg-muted/60 p-0.5">
              <TabsTrigger value="preview" className="text-xs h-7 px-3 flex items-center gap-1.5">
                <Eye className="size-3.5" />
                Rendered Email
              </TabsTrigger>
              <TabsTrigger value="source" className="text-xs h-7 px-3 flex items-center gap-1.5">
                <Code className="size-3.5" />
                Raw Content
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 text-xs gap-1.5 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy Text
                </>
              )}
            </Button>
          </div>

          <TabsContent value="preview" className="flex-1 m-0 p-4 bg-muted/10 overflow-hidden">
            <div className="w-full h-full rounded-lg border border-border/60 overflow-hidden bg-background shadow-xs">
              <iframe
                title="Email Preview"
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </TabsContent>

          <TabsContent value="source" className="flex-1 m-0 p-4 overflow-y-auto">
            <div className="rounded-lg border border-border/60 bg-muted/40 p-4 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed select-all">
              {template.content}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <DialogFooter className="px-6 py-3 border-t border-border/60 shrink-0 bg-card flex items-center justify-between sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
              <Copy className="size-3.5" />
              Copy Content
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onUseTemplate(template);
              }}
              className="gap-1.5 shadow-sm"
            >
              <Send className="size-3.5" />
              Use as Template
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
