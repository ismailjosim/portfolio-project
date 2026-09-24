import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '../../../lib/mongodb';
import NewsletterSubscriber from '../../../models/NewsletterSubscriber';
import { validateSubscriberEmail, emailValidationMessage } from '../../../lib/validate-email';

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

      return NextResponse.json({
        success: true,
        message: 'Welcome back! You have been re-subscribed to our newsletter.',
      });
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    await NewsletterSubscriber.create({
      email,
      name: name || undefined,
      unsubscribeToken,
    });

    return NextResponse.json(
      {
        success: true,
        message: "You're subscribed! 🎉 Expect weekly tech insights in your inbox.",
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
