import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { resend } from '../../../../lib/resend';
import NewsletterSubscriber from '../../../../models/NewsletterSubscriber';
import BlockedEmail from '../../../../models/BlockedEmail';

// POST /api/newsletter/send — broadcast a newsletter to all active, non-blocked subscribers
export async function POST(req: Request) {
  try {
    await connectDB();

    const { subject, html } = await req.json();

    if (!subject || !html) {
      return NextResponse.json(
        { success: false, message: 'Subject and HTML content are required.' },
        { status: 400 }
      );
    }

    // 1. Fetch all blocked emails
    const blockedEmails = await BlockedEmail.find().distinct('email');

    // 2. Fetch active subscribers NOT in the blocked list
    const subscribers = await NewsletterSubscriber.find({
      isActive: true,
      email: { $nin: blockedEmails },
    }).select('+unsubscribeToken');

    if (subscribers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No eligible subscribers found to send to.' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

    // 3. Send email to each subscriber via Resend
    const results: Array<{ email: string; status: 'sent' | 'failed' }> = [];
    for (const sub of subscribers) {
      const unsubscribeUrl = `${baseUrl}/api/newsletter?token=${sub.unsubscribeToken}`;

      try {
        await resend.emails.send({
          from: 'Newsletter <newsletter@resend.dev>',
          to: sub.email,
          subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
              ${html}
              <hr style="margin: 24px 0; border: none, border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #888;">
                You received this email because you subscribed to the newsletter.
                <a href="${unsubscribeUrl}">Unsubscribe</a>.
              </p>
            </div>
          `,
        });
        results.push({ email: sub.email, status: 'sent' });
      } catch (err: unknown) {
        console.error(`[Resend] Failed to send to ${sub.email}:`, err);
        results.push({ email: sub.email, status: 'failed' });
      }
    }

    const sentCount = results.filter((r) => r.status === 'sent').length;
    const failedCount = results.filter((r) => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${sentCount} subscriber(s).`,
      sent: sentCount,
      failed: failedCount,
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