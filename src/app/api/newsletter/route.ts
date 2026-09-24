import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '../../../lib/mongodb';
import NewsletterSubscriber from '../../../models/NewsletterSubscriber';
import BlockedEmail from '../../../models/BlockedEmail';
import { validateSubscriberEmail, emailValidationMessage } from '../../../lib/validate-email';
import { resend } from '../../../lib/resend';

// POST /api/newsletter — subscribe
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || '').trim();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // ── Layer 1: Check if the email is blocked ──────
    const isBlocked = await BlockedEmail.findOne({ email });
    if (isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message: 'This email address is not allowed to subscribe to our newsletter.',
        },
        { status: 403 }
      );
    }

    // ── Layer 2 + 3: Disposable email blocklist + MX record DNS check ──────
    const validation = await validateSubscriberEmail(email);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: emailValidationMessage(validation.reason),
          reason: validation.reason,
        },
        { status: 422 }
      );
    }

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: false, message: 'This email is already subscribed to our newsletter.' },
          { status: 409 }
        );
      }

      // Re-activate unsubscribed user
      existing.isActive = true;
      existing.unsubscribedAt = undefined;
      existing.subscribedAt = new Date();
      if (name) existing.name = name;
      await existing.save();

      // Send welcome email for re-subscription
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/api/newsletter?token=${existing.unsubscribeToken}`;

      await resend.emails.send({
        from: 'Newsletter <newsletter@yourdomain.com>',
        to: email,
        subject: '🎉 Welcome Back! You are Re-subscribed',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2>Welcome back ${name ? name : ''}! 🎉</h2>
            <p>Thank you for re-subscribing to my newsletter. You will start receiving updates again soon.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #888;">
              If you didn't mean to resubscribe, you can <a href="${unsubscribeUrl}">unsubscribe here</a>.
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: 'Welcome back! You have been re-subscribed to our newsletter.',
      });
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const subscriber = await NewsletterSubscriber.create({
      email,
      name: name || undefined,
      unsubscribeToken,
    });

    // Send welcome confirmation email via Resend
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/api/newsletter?token=${subscriber.unsubscribeToken}`;

    await resend.emails.send({
      from: 'Newsletter <newsletter@yourdomain.com>',
      to: email,
      subject: '🎉 Welcome to the Newsletter!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Welcome ${name ? name : ''}! 🎉</h2>
          <p>Thank you for subscribing to my newsletter. You will receive weekly tech insights, articles, and updates directly in your inbox.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">
            If you didn't mean to subscribe, you can <a href="${unsubscribeUrl}">unsubscribe here</a>.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "You're subscribed! 🎉 Confirmation email sent to your inbox.",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('[POST /api/newsletter]', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET /api/newsletter?token=xxx — unsubscribe via token link
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unsubscribe token is missing.' },
        { status: 400 }
      );
    }

    const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired unsubscribe link.' },
        { status: 404 }
      );
    }

    if (!subscriber.isActive) {
      return NextResponse.json({
        success: true,
        message: 'You are already unsubscribed.',
      });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'You have been unsubscribed successfully.',
    });
  } catch (err) {
    console.error('[GET /api/newsletter]', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
