import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import BlockedEmail from '../../../../models/BlockedEmail';
import NewsletterSubscriber from '../../../../models/NewsletterSubscriber';

// GET /api/newsletter/block — list all blocked emails
export async function GET() {
  try {
    await connectDB();
    const blocked = await BlockedEmail.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: blocked });
  } catch (err: unknown) {
    console.error('[GET /api/newsletter/block]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blocked emails.' },
      { status: 500 }
    );
  }
}

// POST /api/newsletter/block — block an email
export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, reason } = await req.json();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 1. Add to Blocked collection (upsert to avoid duplicates)
    await BlockedEmail.findOneAndUpdate(
      { email: cleanEmail },
      { email: cleanEmail, reason: reason || 'Blocked by admin' },
      { upsert: true, new: true }
    );

    // 2. Deactivate any active subscription for this email or create one
    const existingSub = await NewsletterSubscriber.findOne({ email: cleanEmail });
    if (existingSub) {
      existingSub.isActive = false;
      existingSub.unsubscribedAt = new Date();
      await existingSub.save();
    } else {
      const crypto = await import('crypto');
      await NewsletterSubscriber.create({
        email: cleanEmail,
        name: 'Blocked User',
        isActive: false,
        subscribedAt: new Date(),
        unsubscribedAt: new Date(),
        unsubscribeToken: crypto.randomBytes(32).toString('hex'),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Email ${cleanEmail} has been blocked and unsubscribed.`,
    });
  } catch (err: unknown) {
    console.error('[POST /api/newsletter/block]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to block email.' },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter/block?email=xxx — unblock an email
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = (searchParams.get('email') || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }

    await BlockedEmail.deleteOne({ email });

    return NextResponse.json({
      success: true,
      message: `Email ${email} has been unblocked.`,
    });
  } catch (err: unknown) {
    console.error('[DELETE /api/newsletter/block]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to unblock email.' },
      { status: 500 }
    );
  }
}