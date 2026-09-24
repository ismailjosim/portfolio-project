'use client';

import { Mail, Calendar, Shield, User, ExternalLink, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { Subscriber } from '@/src/types/newsletter.interface';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Badge } from '../../ui/badge';
import InfoRow from '../../shared/InfoRow';
import { Separator } from '../../ui/separator';
import { Button } from '../../ui/button';

interface SubscriberViewDetailDialogProps {
  open: boolean;
  onClose: () => void;
  subscriber: Subscriber | null;
  onInitiateBlock?: (email: string) => void;
  onInitiateUnblock?: (email: string) => void;
}

export function SubscriberViewDetailDialog({
  open,
  onClose,
  subscriber,
  onInitiateBlock,
  onInitiateUnblock,
}: SubscriberViewDetailDialogProps) {
  if (!subscriber) return null;

  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return 'N/A';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isBlocked = subscriber.status === 'blocked' || subscriber.isBlocked;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-full max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 shrink-0">
          <DialogTitle>Subscriber Details</DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Header Card */}
          <div className="flex items-start sm:items-center gap-4 p-4 rounded-xl bg-card border border-border">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
              {(subscriber.name?.trim() ? subscriber.name[0] : subscriber.email[0])?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground font-mono truncate" title={subscriber.email}>
                {subscriber.email}
              </h2>
              <p className="text-sm text-muted-foreground truncate mb-2">
                {subscriber.name || 'No name provided'}
              </p>
              <div className="flex items-center gap-2">
                {isBlocked ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                    <Shield className="size-3 mr-1" />
                    Blocked
                  </Badge>
                ) : subscriber.status === 'pending' ? (
                  <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/20 text-xs">
                    <span className="size-1.5 rounded-full bg-sky-500 mr-1.5 animate-pulse" />
                    Pending Verification
                  </Badge>
                ) : subscriber.isActive ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                    <CheckCircle2 className="size-3 mr-1" />
                    Active Subscriber
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-xs">
                    <XCircle className="size-3 mr-1" />
                    Unsubscribed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Subscriber Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="size-4 text-primary" />
              <h3 className="font-semibold text-sm">Subscriber Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border border-border/50">
              <div className="flex items-start gap-3">
                <Mail className="size-4 mt-1 text-muted-foreground shrink-0" />
                <InfoRow label="Email Address" value={subscriber.email} />
              </div>
              <div className="flex items-start gap-3">
                <User className="size-4 mt-1 text-muted-foreground shrink-0" />
                <InfoRow label="Name" value={subscriber.name || 'Not provided'} />
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="size-4 mt-1 shrink-0" />
                <InfoRow label="System ID" value={subscriber._id} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Subscription Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="size-4 text-blue-500" />
              <h3 className="font-semibold text-sm">Timeline & Activity</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border border-border/50">
              <div className="flex items-start gap-3">
                <Calendar className="size-4 mt-1 text-muted-foreground shrink-0" />
                <InfoRow label="Subscribed At" value={formatDate(subscriber.subscribedAt || subscriber.createdAt)} />
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="size-4 mt-1 text-muted-foreground shrink-0" />
                <InfoRow
                  label="Unsubscribed At"
                  value={subscriber.unsubscribedAt ? formatDate(subscriber.unsubscribedAt) : 'Never (Still subscribed)'}
                />
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="size-4 mt-1 text-muted-foreground shrink-0" />
                <InfoRow label="Created Record" value={formatDate(subscriber.createdAt)} />
              </div>
            </div>
          </div>

          {/* Block info if blocked */}
          {isBlocked && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3 text-amber-500">
                  <ShieldAlert className="size-4" />
                  <h3 className="font-semibold text-sm">Block Details</h3>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg space-y-2">
                  <p className="text-xs text-amber-500 font-medium">
                    This email is blacklisted from receiving newsletters and subscribing.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reason: <span className="font-medium text-foreground">{subscriber.blockReason || 'Blocked by admin'}</span>
                  </p>
                  {subscriber.blockedAt && (
                    <p className="text-xs text-muted-foreground">
                      Blocked on: <span className="font-medium text-foreground">{formatDate(subscriber.blockedAt)}</span>
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border/60 bg-card shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`mailto:${subscriber.email}`)}
            className="text-xs"
          >
            <Mail className="size-3.5 mr-1.5" />
            Send Direct Email
            <ExternalLink className="size-3 ml-1 opacity-60" />
          </Button>

          <div className="flex items-center gap-2">
            {isBlocked ? (
              onInitiateUnblock && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInitiateUnblock(subscriber.email)}
                  className="text-emerald-600 hover:text-emerald-700 text-xs"
                >
                  Unblock
                </Button>
              )
            ) : (
              onInitiateBlock && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInitiateBlock(subscriber.email)}
                  className="text-amber-600 hover:text-amber-700 text-xs"
                >
                  <Shield className="size-3 mr-1" />
                  Block
                </Button>
              )
            )}
            <Button size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SubscriberViewDetailDialog;
