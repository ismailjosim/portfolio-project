import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { resend } from '../../../../lib/resend';
import NewsletterSubscriber from '../../../../models/NewsletterSubscriber';
import BlockedEmail from '../../../../models/BlockedEmail';
import NewsletterTemplate from '../../../../models/NewsletterTemplate';
import { compileNewsletterToHtml } from '../../../../lib/newsletter-compiler';
import { logEmailSent } from '@/src/lib/email-logger';

// POST /api/newsletter/send — broadcast a newsletter to all active, verified, non-blocked subscribers
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { subject, content, html } = body;

    const emailContent = content || html;

    if (!subject || !emailContent) {
      return NextResponse.json(
        { success: false, message: 'Subject and newsletter content are required.' },
        { status: 400 }
      );
    }

    // 1. Fetch all blocked emails
    const blockedEmails = await BlockedEmail.find().distinct('email');

    // 2. Fetch active subscribers NOT in the blocked list (must be verified)
    const subscribers = await NewsletterSubscriber.find({
      isActive: true,
      isVerified: { $ne: false },
      email: { $nin: blockedEmails },
    }).select('+unsubscribeToken');

    if (subscribers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No eligible active verified subscribers found to send to.' },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://www.ismailjosim.com'
        : 'http://localhost:3000');

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'Ismail Josim <newsletter@contact.ismailjosim.com>';

    // 3. Send email to each subscriber via Resend
    const results: Array<{ email: string; status: 'sent' | 'failed'; error?: string }> = [];

    for (const sub of subscribers) {
      const unsubscribeUrl = `${baseUrl}/api/newsletter?token=${sub.unsubscribeToken}`;
      const subscriberName = (sub.name || '').trim();
      const fallbackName = subscriberName || 'there';

      // Compile plain text / markdown into responsive HTML email template with personalized subscriber variables
      const formattedHtml = content
        ? compileNewsletterToHtml(content, {
            subject,
            unsubscribeUrl,
            senderName: 'Ismail Josim',
            subscriberName: fallbackName,
            subscriberEmail: sub.email,
          })
        : (html || '')
            .replace(/\{\{\s*name\s*\}\}/gi, fallbackName)
            .replace(/\{\{\s*first_name\s*\}\}/gi, fallbackName.split(' ')[0] || fallbackName)
            .replace(/\{\{\s*firstName\s*\}\}/gi, fallbackName.split(' ')[0] || fallbackName)
            .replace(/\{\{\s*email\s*\}\}/gi, sub.email)
            .replace(/\{\{\s*unsubscribe_url\s*\}\}/gi, unsubscribeUrl)
            .replace(/\{\{\s*unsubscribeUrl\s*\}\}/gi, unsubscribeUrl);

      // Support dynamic {{name}} in subject line as well
      const personalizedSubject = subject
        .replace(/\{\{\s*name\s*\}\}/gi, fallbackName)
        .replace(/\{\{\s*email\s*\}\}/gi, sub.email);

      try {
        const { error } = await resend.emails.send({
          from: fromEmail,
          to: sub.email,
          subject: personalizedSubject,
          html: formattedHtml,
        });

        if (error) {
          console.error(`[Resend] Failed to send to ${sub.email}:`, error);
          results.push({ email: sub.email, status: 'failed', error: error.message });
          await logEmailSent({
            recipient: sub.email,
            subject: personalizedSubject,
            type: 'newsletter',
            status: 'failed',
            error: error.message,
          });
        } else {
          results.push({ email: sub.email, status: 'sent' });
          await logEmailSent({
            recipient: sub.email,
            subject: personalizedSubject,
            type: 'newsletter',
            status: 'sent',
          });
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`[Resend Exception] Failed to send to ${sub.email}:`, err);
        results.push({ email: sub.email, status: 'failed', error: errorMsg });
        await logEmailSent({
          recipient: sub.email,
          subject,
          type: 'newsletter',
          status: 'failed',
          error: errorMsg,
        });
      }
    }

    const sentCount = results.filter((r) => r.status === 'sent').length;
    const failedResults = results.filter((r) => r.status === 'failed');
    const failedCount = failedResults.length;

    if (sentCount === 0 && failedCount > 0) {
      const firstError = failedResults[0]?.error || 'Failed to deliver emails through Resend.';
      return NextResponse.json(
        {
          success: false,
          message: `Resend error: ${firstError}`,
          sent: 0,
          failed: failedCount,
          total: subscribers.length,
        },
        { status: 400 }
      );
    }

    // Save one copy of the sent email in database as a reusable template
    try {
      await NewsletterTemplate.create({
        subject: subject.trim(),
        content: content ? content.trim() : (html || '').trim(),
        html: content
          ? compileNewsletterToHtml(content, {
              subject,
              senderName: 'Ismail Josim',
              unsubscribeUrl: '#unsubscribe',
              subscriberName: 'Subscriber',
            })
          : html,
        recipientCount: sentCount,
        sentAt: new Date(),
      });
    } catch (saveErr) {
      console.error('[NewsletterTemplate] Failed to archive sent newsletter template:', saveErr);
    }

    if (failedCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Sent to ${sentCount} subscriber(s), but ${failedCount} failed.`,
        sent: sentCount,
        failed: failedCount,
        total: subscribers.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter broadcast sent successfully to ${sentCount} subscriber(s)! 🎉`,
      sent: sentCount,
      failed: 0,
      total: subscribers.length,
    });
  } catch (err: unknown) {
    console.error('[POST /api/newsletter/send]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to broadcast newsletter.' },
      { status: 500 }
    );
  }
}
