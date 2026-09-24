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

export function BlockEmailDialog({
  open,
  onOpenChange,
  initialEmail = '',
  onSuccess,
}: BlockEmailDialogProps) {
  const [reason, setReason] = useState('Manually blocked');
  const [loading, setLoading] = useState(false);

  // Derive email directly from props without state
  const email = initialEmail;

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setReason('Manually blocked');
    }
    onOpenChange(newOpen);
  };

  const handleBlock = async () => {
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        handleOpenChange(false);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Email Address</DialogTitle>
          <DialogDescription>
            This email will be prevented from subscribing and excluded from broadcasts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="block-email">Email Address</Label>
            <Input
              id="block-email"
              type="email"
              value={email}
              readOnly
              className="mt-1 bg-muted cursor-not-allowed"
            />
          </div>
          <div>
            <Label htmlFor="block-reason">Reason (optional)</Label>
            <Textarea
              id="block-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleBlock} disabled={loading}>
            <Shield className="h-4 w-4 mr-2" />
            {loading ? 'Blocking...' : 'Block Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
