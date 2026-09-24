import type { Metadata } from 'next';
import Link from 'next/link';
import { MailMinus, AlertTriangle, Home, CheckCircle2, RotateCcw } from 'lucide-react';
import { connectDB } from '@/src/lib/mongodb';
import NewsletterSubscriber from '@/src/models/NewsletterSubscriber';
import { Button } from '@/src/components/ui/button';
import { revalidatePath } from 'next/cache';

export const metadata: Metadata = {
  title: 'Unsubscribe — Newsletter',
  description: 'Unsubscribe from the newsletter.',
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let state: 'active' | 'unsubscribed' | 'invalid' | 'missing' = 'missing';
  let subscriberEmail = '';

  if (token) {
    try {
      await connectDB();
      const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });

      if (!subscriber) {
        state = 'invalid';
      } else {
        subscriberEmail = subscriber.email;
        state = subscriber.isActive ? 'active' : 'unsubscribed';
      }
    } catch (err) {
      console.error('[Newsletter Unsubscribe Error]', err);
      state = 'invalid';
    }
  }

  async function resubscribeAction(formData: FormData) {
    'use server';
    const actionToken = formData.get('token') as string;
    if (!actionToken) return;

    await connectDB();
    const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: actionToken });
    if (subscriber) {
      subscriber.isActive = true;
      subscriber.unsubscribedAt = undefined;
      await subscriber.save();
      revalidatePath('/newsletter/unsubscribe');
    }
  }

  async function unsubscribeAction(formData: FormData) {
    'use server';
    const actionToken = formData.get('token') as string;
    if (!actionToken) return;

    await connectDB();
    const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: actionToken });
    if (subscriber) {
      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();
      revalidatePath('/newsletter/unsubscribe');
    }
  }

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">
      {/* Decorative background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg">
        {state === 'unsubscribed' ? (
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-8 md:p-10 shadow-2xl text-center space-y-6">
            <div className="size-18 mx-auto rounded-full bg-muted text-muted-foreground flex items-center justify-center border border-border">
              <MailMinus className="size-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Unsubscribed
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                You are currently unsubscribed. You won&apos;t receive any more newsletters.
              </p>
            </div>

            {subscriberEmail && (
              <div className="rounded-lg bg-muted/50 border border-border p-3.5 text-xs text-muted-foreground">
                Email address:{' '}
                <strong className="text-foreground font-mono">{subscriberEmail}</strong>
              </div>
            )}

            <div className="pt-4 flex flex-col items-center gap-4">
              <form action={resubscribeAction} className="w-full sm:w-auto">
                <input type="hidden" name="token" value={token || ''} />
                <Button type="submit" className="w-full sm:w-auto group">
                  <RotateCcw className="size-4 mr-2 transition-transform group-hover:-rotate-90" />
                  Resubscribe
                </Button>
              </form>
              <Button asChild variant="ghost" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="size-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        ) : state === 'active' ? (
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-8 md:p-10 shadow-2xl text-center space-y-6">
            <div className="size-18 mx-auto rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                You are Subscribed 🎉
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                You are actively subscribed to the newsletter!
              </p>
            </div>

            {subscriberEmail && (
              <div className="rounded-lg bg-muted/50 border border-border p-3.5 text-xs text-muted-foreground">
                Email address:{' '}
                <strong className="text-foreground font-mono">{subscriberEmail}</strong>
              </div>
            )}

            <div className="pt-4 flex flex-col items-center gap-4">
              <form action={unsubscribeAction} className="w-full sm:w-auto">
                <input type="hidden" name="token" value={token || ''} />
                <Button type="submit" variant="destructive" className="w-full sm:w-auto">
                  <MailMinus className="size-4 mr-2" />
                  Unsubscribe Again
                </Button>
              </form>
              <Button asChild variant="ghost" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="size-4 mr-2" />
                  Go to Home
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-8 md:p-10 shadow-2xl text-center space-y-6">
            <div className="size-18 mx-auto rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="size-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Invalid Unsubscribe Link
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We could not find an active subscription for this link. It may be broken or expired.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Button asChild>
                <Link href="/">
                  <Home className="size-4 mr-2" />
                  Go to Home
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
