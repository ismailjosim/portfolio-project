'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
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

export function SendNewsletterDialog() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error('Subject and content are required');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html: content }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setSubject('');
        setContent('');
        setOpen(false);
      } else {
        toast.error(data.message || 'Failed to send');
      }
    } catch {
      toast.error('Failed to send newsletter');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Send Newsletter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Send Newsletter</DialogTitle>
          <DialogDescription>
            Create and send a newsletter to all active subscribers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Newsletter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="content">Content (HTML)</Label>
            <Textarea
              id="content"
              placeholder="Write your newsletter content in HTML..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send to All Subscribers'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
