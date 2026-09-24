'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';

interface BlockEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
  onSuccess: () => void;
}

interface BlockEmailFormProps {
  initialEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

function BlockEmailForm({ initialEmail, onClose, onSuccess }: BlockEmailFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [reason, setReason] = useState('Manually blocked');
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error('Please enter an email address');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, reason: reason.trim() || 'Manually blocked' }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Email blocked successfully');
        onClose();
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to block email');
      }
    } catch {
      toast.error('Failed to block email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4 py-2">
        <div>
          <Label htmlFor="block-email">Email Address</Label>
          <Input
            id="block-email"
            type="email"
            placeholder="subscriber@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!!initialEmail}
            className={`mt-1.5 ${initialEmail ? 'bg-muted cursor-not-allowed' : ''}`}
          />
        </div>
        <div>
          <Label htmlFor="block-reason">Reason (optional)</Label>
          <Textarea
            id="block-reason"
            placeholder="Spam, bounced, requested removal, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-1.5 resize-none"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleBlock}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Shield className="h-4 w-4 mr-2" />
          {loading ? 'Blocking...' : 'Block Email'}
        </Button>
      </DialogFooter>
    </>
  );
}

export function BlockEmailDialog({
  open,
  onOpenChange,
  initialEmail = '',
  onSuccess,
}: BlockEmailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Block Email Address
          </DialogTitle>
          <DialogDescription>
            This email will be prevented from subscribing and excluded from all future broadcasts.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <BlockEmailForm
            key={`${initialEmail}-${open}`}
            initialEmail={initialEmail}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
