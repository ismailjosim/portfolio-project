import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Home, MailCheck } from 'lucide-react';
import { connectDB } from '@/src/lib/mongodb';
import NewsletterSubscriber from '@/src/models/NewsletterSubscriber';
import { resend } from '@/src/lib/resend';
import { logEmailSent } from '@/src/lib/email-logger';
import { Button } from '@/src/components/ui/button';

export const metadata: Metadata = {
  title: 'Subscription Confirmed — Newsletter',
  description: 'Your newsletter subscription has been successfully verified.',
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let state: 'success' | 'expired' | 'invalid' | 'missing' = 'missing';
  let subscriberEmail = '';
  let subscriberName = '';

  if (token) {
    try {
      await connectDB();
      const subscriber = await NewsletterSubscriber.findOne({ verificationToken: token });

      if (!subscriber) {
        state = 'invalid';
      } else if (
        subscriber.verificationTokenExpires &&
        new Date(subscriber.verificationTokenExpires) < new Date()
      ) {
        state = 'expired';
      } else {
        subscriberEmail = subscriber.email;
        subscriberName = subscriber.name || '';

        // Mark as verified & active
        subscriber.isVerified = true;
        subscriber.isActive = true;
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = undefined;
        subscriber.verificationToken = undefined;
        subscriber.verificationTokenExpires = undefined;
        await subscriber.save();

        state = 'success';

        // Send Welcome email via Resend
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ||
          (process.env.NODE_ENV === 'production'
            ? 'https://www.ismailjosim.com'
            : 'http://localhost:3000');
        const unsubscribeUrl = `${baseUrl}/api/newsletter?token=${subscriber.unsubscribeToken}`;
        const fromEmail =
          process.env.RESEND_FROM_EMAIL || 'Ismail Josim <newsletter@contact.ismailjosim.com>';

        try {
          const { error: welcomeError } = await resend.emails.send({
            from: fromEmail,
            to: subscriber.email,
            subject: 'Welcome! 🚀',
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to the Newsletter!</title>
              </head>
              <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 15px;">
                  <tr>
                    <td align="center">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <tr>
                          <td style="padding: 36px 32px 28px;">
                            <p style="font-size: 16px; color: #0f172a; margin: 0 0 16px;">
                              Hey ${subscriberName ? subscriberName : 'there'},
                            </p>
                            <p style="font-size: 15px; color: #334155; margin: 0 0 20px; line-height: 1.6;">
                              Thanks for subscribing to my email list. It&apos;s great to have you ✌️
                            </p>

                            <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin: 0 0 12px;">
                              By subscribing to my mailing list, you&apos;ll receive:
                            </p>

                            <p style="font-size: 14px; color: #334155; margin: 0 0 10px; line-height: 1.6;">
                              <strong style="color: #0f172a;">1)</strong> Occasional updates on real-world projects, source code, and new course/resource releases.
                            </p>
                            <p style="font-size: 14px; color: #334155; margin: 0 0 20px; line-height: 1.6;">
                              <strong style="color: #0f172a;">2)</strong> My newsletter with curated tech insights, helpful articles, and web dev tools that I think you should know about.
                            </p>

                            <p style="font-size: 15px; color: #334155; margin: 0 0 24px; line-height: 1.6;">
                              I hope this sounds useful! 😎
                            </p>

                            <p style="font-size: 15px; color: #334155; margin: 0 0 6px;">
                              Happy learning! ✌️
                            </p>
                            <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin: 0;">
                              -- Ismail Josim
                            </p>

                            <hr style="margin: 36px 0 20px; border: none; border-top: 1px solid #e2e8f0;" />

                            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0 0 6px;">
                              You&apos;re receiving this email because you subscribed to updates on <a href="${baseUrl}" target="_blank" style="color: #64748b; text-decoration: none;">ismailjosim.com</a>.
                            </p>
                            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
                              If you no longer wish to receive any of my emails, just <a href="${unsubscribeUrl}" target="_blank" style="color: #64748b; text-decoration: underline;">unsubscribe here</a>.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `,
          });

          if (welcomeError) {
            console.error('[Welcome Email Error]', welcomeError);
            await logEmailSent({
              recipient: subscriber.email,
              subject: 'Welcome! 🚀',
              type: 'welcome',
              status: 'failed',
              error: welcomeError.message,
            });
          } else {
            await logEmailSent({
              recipient: subscriber.email,
              subject: 'Welcome! 🚀',
              type: 'welcome',
              status: 'sent',
            });
          }
        } catch (emailErr) {
          console.error('[Welcome Email Failed]', emailErr);
          await logEmailSent({
            recipient: subscriber.email,
            subject: 'Welcome! 🚀',
            type: 'welcome',
            status: 'failed',
            error: emailErr instanceof Error ? emailErr.message : String(emailErr),
          });
        }
      }
    } catch (err) {
      console.error('[Newsletter Confirm Error]', err);
      state = 'invalid';
    }
  }

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">
      {/* Decorative background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg">
        {state === 'success' ? (
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-8 md:p-10 shadow-2xl text-center space-y-6">
            <div className="size-18 mx-auto rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <MailCheck className="size-3.5" />
                Verified & Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Subscription Confirmed! 🎉
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Thank you for confirming your email. You are now officially subscribed to the newsletter.
              </p>
            </div>

            {subscriberEmail && (
              <div className="rounded-lg bg-muted/50 border border-border p-3.5 text-xs text-muted-foreground">
                A welcome email has just been sent to{' '}
                <strong className="text-foreground font-mono">{subscriberEmail}</strong>.
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="size-4 mr-2" />
                  Explore Portfolio
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/blogs">
                  <BookOpen className="size-4 mr-2" />
                  Read Blog Articles
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
                {state === 'expired'
                  ? 'Verification Link Expired'
                  : 'Invalid Verification Link'}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {state === 'expired'
                  ? 'This confirmation link has expired (links are valid for 24 hours). Please re-subscribe on the home page to receive a fresh verification link.'
                  : 'We could not find an active verification request for this link. You may already be confirmed or the link was altered.'}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Button asChild>
                <Link href="/#newsletter">
                  Back to Newsletter Section
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
