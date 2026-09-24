'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Send,
  Image as ImageIcon,
  Link as LinkIcon,
  Smile,
  Eye,
  Edit3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Sparkles,
  User,
} from 'lucide-react';
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

const QUICK_EMOJIS = [
  '✌️',
  '🚀',
  '🎉',
  '🔥',
  '💡',
  '💻',
  '✨',
  '📌',
  '👍',
  '❤️',
  '😎',
  '📩',
  '🎯',
  '⚡',
];

interface SendNewsletterDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function SendNewsletterDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: SendNewsletterDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter the URL (e.g. https://github.com/username):');
    if (!url) return;
    const title = prompt('Enter the link title (optional):', 'Click here') || 'Click here';
    insertAtCursor(`[${title}](${url})`);
  };

  const handleAddButton = () => {
    const url = prompt('Enter button link URL (e.g. https://www.ismailjosim.com/projects):');
    if (!url) return;
    const label = prompt('Enter button text:', '👉 View Project') || '👉 View Project';
    insertAtCursor(`\n\n[button:${label}](${url})\n\n`);
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

      <DialogContent className="max-w-3xl max-h-[92vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border/60 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="size-5 text-primary" />
            Compose Newsletter Broadcast
          </DialogTitle>
          <DialogDescription>
            Write normal plain text or Markdown with photos, links, and buttons. We format it into a
            responsive email template automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Subject Line */}
          <div>
            <Label htmlFor="newsletter-subject" className="text-xs font-semibold text-foreground">
              Subject Line <span className="text-destructive">*</span>
            </Label>
            <Input
              id="newsletter-subject"
              placeholder="e.g. 🚀 New portfolio launch & weekly dev tools you need"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 font-medium"
            />
          </div>

          {/* Editor & Preview Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as 'write' | 'preview')}
            className="w-full"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
              <TabsList className="grid grid-cols-2 w-48 h-8">
                <TabsTrigger value="write" className="text-xs flex items-center gap-1.5">
                  <Edit3 className="size-3.5" />
                  Write
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs flex items-center gap-1.5">
                  <Eye className="size-3.5" />
                  Preview
                </TabsTrigger>
              </TabsList>

              {/* Toolbar Controls (Visible when on Write tab) */}
              {activeTab === 'write' && (
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    title="Upload & attach photo"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="size-3.5 animate-spin mr-1" />
                    ) : (
                      <ImageIcon className="size-3.5 mr-1 text-emerald-500" />
                    )}
                    Photo
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20"
                    onClick={() => insertAtCursor('{{name}}')}
                    title="Insert dynamic subscriber name merge tag"
                  >
                    <User className="size-3.5 mr-1" />
                    {"{{name}}"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={handleAddButton}
                    title="Insert Call-to-action button"
                  >
                    <Sparkles className="size-3.5 mr-1 text-primary" />
                    Button
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={handleAddLink}
                    title="Insert link"
                  >
                    <LinkIcon className="size-3.5 mr-1 text-blue-500" />
                    Link
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs font-bold"
                    onClick={() => insertAtCursor('**bold text**')}
                    title="Bold"
                  >
                    <Bold className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs italic"
                    onClick={() => insertAtCursor('*italic text*')}
                    title="Italic"
                  >
                    <Italic className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => insertAtCursor('\n- list item')}
                    title="Bullet List"
                  >
                    <List className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => insertAtCursor('\n1. first item')}
                    title="Numbered List"
                  >
                    <ListOrdered className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Write Tab Content */}
            <TabsContent value="write" className="mt-3 space-y-2">
              {/* Quick Emojis Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 rounded-md bg-muted/40 border border-border/50">
                <span className="text-xs text-muted-foreground flex items-center gap-1 px-1.5 shrink-0 font-medium">
                  <Smile className="size-3.5" />
                  Quick:
                </span>
                <div className="flex items-center gap-1">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertAtCursor(emoji)}
                      className="size-7 rounded hover:bg-muted text-sm flex items-center justify-center transition-colors cursor-pointer"
                      title={`Insert ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plain Textarea */}
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
                rows={13}
                className="font-sans text-sm leading-relaxed resize-none p-3.5 focus-visible:ring-1"
              />

              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                <span>
                  Tip: Use <code className="text-amber-500">{"{{name}}"}</code> for dynamic recipient names, <strong>**bold**</strong>, <em>*italic*</em>, <code>[Link](url)</code>, or click <strong>Photo</strong>.
                </span>
                <span>{content.length} characters</span>
              </div>
            </TabsContent>

            {/* Preview Tab Content */}
            <TabsContent value="preview" className="mt-3">
              <div className="rounded-xl border border-border bg-slate-100 dark:bg-slate-900/50 p-4 max-h-115 overflow-y-auto">
                <div className="max-w-140 mx-auto bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 overflow-hidden text-sm">
                  {/* Preview Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Ismail Josim</h4>
                      <p className="text-xs text-slate-500">Weekly Tech & Dev Newsletter</p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Newsletter
                    </span>
                  </div>

                  {/* Preview Subject */}
                  {subject && (
                    <div className="px-5 pt-4 pb-1">
                      <p className="font-bold text-slate-900 text-lg">{subject}</p>
                    </div>
                  )}

                  {/* Preview Body rendered via iframe srcdoc for clean isolation */}
                  <div className="p-5 space-y-3">
                    <iframe
                      srcDoc={previewHtml}
                      title="Email Preview"
                      className="w-full h-80 border-0 rounded"
                    />
                  </div>

                  {/* Preview Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
                    <p>You received this email because you subscribed on ismailjosim.com.</p>
                    <p className="text-[11px] text-slate-400 mt-1 underline">Unsubscribe</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-card shrink-0 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Sending Broadcast...
              </>
            ) : (
              <>
                <Send className="size-4 mr-2" />
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
