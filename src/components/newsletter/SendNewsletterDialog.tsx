'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Send, Eye, Edit3, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { uploadImage } from '@/src/services/upload.action';
import { compileNewsletterToHtml } from '@/src/lib/newsletter-compiler';
import { NewsletterEditorToolbar } from './NewsletterEditorToolbar';
import { NewsletterEmojiBar } from './NewsletterEmojiBar';
import { NewsletterPreviewCard } from './NewsletterPreviewCard';

interface SendNewsletterDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  initialSubject?: string;
  initialContent?: string;
  onSuccess?: () => void;
}

export function SendNewsletterDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  initialSubject = '',
  initialContent = '',
  onSuccess,
}: SendNewsletterDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevInitial, setPrevInitial] = useState({
    subject: initialSubject,
    content: initialContent,
  });

  if (
    open !== prevOpen ||
    prevInitial.subject !== initialSubject ||
    prevInitial.content !== initialContent
  ) {
    setPrevOpen(open);
    setPrevInitial({ subject: initialSubject, content: initialContent });

    if (open) {
      if (initialSubject) setSubject(initialSubject);
      if (initialContent) setContent(initialContent);
    }
  }

  // Insert text at current cursor position in textarea
  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previous = textarea.value;

    const nextValue = previous.substring(0, start) + textToInsert + previous.substring(end);
    setContent(nextValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const handleUploadImage = async (file: File) => {
    setIsUploadingImage(true);
    const toastId = toast.loading('Uploading photo...');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'newsletter_images');

      const result = await uploadImage(formData, 'newsletter_images');

      if (result.success && result.url) {
        toast.success('Photo uploaded!', { id: toastId });
        insertAtCursor(`\n\n![Newsletter Image](${result.url})\n\n`);
      } else {
        toast.error(result.message || 'Failed to upload photo', { id: toastId });
      }
    } catch {
      toast.error('Error uploading photo to Cloudinary', { id: toastId });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!content.trim()) {
      toast.error('Newsletter content is required');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          content: content.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Newsletter broadcast sent successfully!');
        setSubject('');
        setContent('');
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(data.message || 'Failed to send newsletter');
      }
    } catch {
      toast.error('Failed to broadcast newsletter');
    } finally {
      setIsSending(false);
    }
  };

  const previewHtml = compileNewsletterToHtml(content, {
    subject: subject || 'Newsletter Preview',
    senderName: 'Ismail Josim',
    unsubscribeUrl: '#unsubscribe',
    subscriberName: 'John',
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button>
            <Send className="size-4 mr-2" />
            Send Newsletter
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-4xl lg:max-w-5xl w-[96vw] h-[92vh] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-card">
        {/* Fixed Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/60 shrink-0 bg-card">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Send className="size-5 text-primary" />
            Compose Newsletter Broadcast
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Write normal plain text or Markdown with photos, links, and buttons. We format it into a
            responsive email template automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs & Controls Container */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'write' | 'preview')}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          {/* ── Fixed Top Controls Bar (Subject Line, Toolbar & Quick Emojis) ── */}
          <div className="px-6 pt-3.5 pb-3 space-y-3 shrink-0 bg-card/95 backdrop-blur-sm border-b border-border/60 z-10">
            <div>
              <Label htmlFor="newsletter-subject" className="text-xs font-semibold text-foreground">
                Subject Line <span className="text-destructive">*</span>
              </Label>
              <Input
                id="newsletter-subject"
                placeholder="e.g. 🚀 New portfolio launch & weekly dev tools you need"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 font-medium h-10"
              />
            </div>

            {/* Tab Switcher & Formatting Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <TabsList className="grid grid-cols-2 w-48 h-8 shrink-0">
                <TabsTrigger value="write" className="text-xs flex items-center gap-1.5">
                  <Edit3 className="size-3.5" />
                  Write
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs flex items-center gap-1.5">
                  <Eye className="size-3.5" />
                  Preview
                </TabsTrigger>
              </TabsList>

              {activeTab === 'write' && (
                <NewsletterEditorToolbar
                  onInsert={insertAtCursor}
                  isUploadingImage={isUploadingImage}
                  onUploadImage={handleUploadImage}
                />
              )}
            </div>

            {/* Quick Emojis Row */}
            {activeTab === 'write' && <NewsletterEmojiBar onSelectEmoji={insertAtCursor} />}
          </div>

          {/* ── Scrollable Body Content (Textarea or Preview) ── */}
          <div className="flex-1 flex flex-col min-h-0 px-6 py-3 overflow-hidden">
            <TabsContent value="write" className="m-0 flex-1 flex flex-col min-h-0 space-y-2">
              <Textarea
                ref={textareaRef}
                id="newsletter-content"
                placeholder={`Hey {{name}},

Thanks for being part of the newsletter list! ✌️

Here is what I built this week:
- Complete portfolio redesign with Next.js 16
- Performance optimization & SEO score 100%

[button:👉 Check Out Live Demo](https://www.ismailjosim.com)

Hope you enjoy this update! Let me know what you think.

-- Ismail Josim`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full flex-1 min-h-0 font-sans text-sm leading-relaxed p-4 resize-none overflow-y-auto border-border/70 focus-visible:ring-1 bg-background/50 rounded-xl"
              />

              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 shrink-0 pt-0.5">
                <span>
                  Tip: Use <code className="text-amber-500 font-mono">{'{{name}}'}</code> for
                  dynamic recipient names, <strong>**bold**</strong>, <em>*italic*</em>,{' '}
                  <code>[Link](url)</code>, or click <strong>Photo</strong>.
                </span>
                <span className="font-mono">{content.length} characters</span>
              </div>
            </TabsContent>

            <TabsContent
              value="preview"
              className="m-0 flex-1 flex flex-col min-h-0 overflow-y-auto"
            >
              <NewsletterPreviewCard subject={subject} previewHtml={previewHtml} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-3.5 border-t border-border/60 bg-card shrink-0 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="gap-2 shadow-md shadow-primary/20"
          >
            {isSending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending Broadcast...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Send to All Subscribers
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SendNewsletterDialog;
