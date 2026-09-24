import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '../../../lib/mongodb';
import NewsletterSubscriber from '../../../models/NewsletterSubscriber';
import BlockedEmail from '../../../models/BlockedEmail';
import { validateSubscriberEmail, emailValidationMessage } from '../../../lib/validate-email';
import { resend } from '../../../lib/resend';
import { logEmailSent } from '../../../lib/email-logger';

// POST /api/newsletter — subscribe with double opt-in email verification
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

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const existing = await NewsletterSubscriber.findOne({ email });

    if (existing) {
      if (existing.isActive && existing.isVerified) {
        return NextResponse.json(
          { success: false, message: 'This email is already subscribed and active.' },
          { status: 409 }
        );
      }

      existing.name = name || existing.name;
      existing.isVerified = false;
      existing.isActive = false;
      existing.verificationToken = verificationToken;
      existing.verificationTokenExpires = verificationTokenExpires;
      await existing.save();
    } else {
      const unsubscribeToken = crypto.randomBytes(32).toString('hex');
      await NewsletterSubscriber.create({
        email,
        name: name || undefined,
        isActive: false,
        isVerified: false,
        verificationToken,
        verificationTokenExpires,
        unsubscribeToken,
      });
    }

    // Send confirmation email via Resend
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://www.ismailjosim.com'
        : 'http://localhost:3000');

    const confirmUrl = `${baseUrl}/newsletter/confirm?token=${verificationToken}`;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'Ismail Josim <newsletter@contact.ismailjosim.com>';

    const { error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Important: confirm your subscription',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Subscription</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <tr>
                    <td style="padding: 36px 32px 28px;">
                      <p style="font-size: 17px; font-weight: 600; color: #0f172a; margin: 0 0 16px;">
                        Thank you for signing up${name ? `, ${name}` : ''}!
                      </p>
                      <p style="font-size: 15px; color: #334155; margin: 0 0 24px; line-height: 1.6;">
                        Please click the link below to confirm your subscription:
                      </p>

                      <!-- Green confirmation button -->
                      <div style="margin: 28px 0;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#10b981" style="border-radius: 8px;">
                              <a href="${confirmUrl}" target="_blank" style="padding: 13px 28px; font-weight: 600; color: #ffffff; text-decoration: none; display: inline-block; font-size: 15px; border-radius: 8px; background-color: #10b981;">
                                Confirm your subscription
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <p style="font-size: 15px; color: #334155; margin: 28px 0 6px; line-height: 1.6;">
                        It&apos;s good to have you ✌️
                      </p>
                      <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin: 0;">
                        -- Ismail Josim
                      </p>

                      <hr style="margin: 36px 0 20px; border: none; border-top: 1px solid #e2e8f0;" />

                      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0 0 6px;">
                        You&apos;re receiving this email because you subscribed to updates on <a href="${baseUrl}" target="_blank" style="color: #64748b; text-decoration: none;">ismailjosim.com</a>.
                      </p>
                      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
                        This confirmation link will expire in 24 hours. If you did not make this request, you can simply ignore this email.
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

    if (resendError) {
      console.error('[Resend Verification Email Error]', resendError);
      await logEmailSent({
        recipient: email,
        subject: 'Confirm your subscription to Ismail Josim’s newsletter',
        type: 'verification',
        status: 'failed',
        error: resendError.message,
      });
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send confirmation email: ${resendError.message}`,
        },
        { status: 500 }
      );
    }

    await logEmailSent({
      recipient: email,
      subject: 'Confirm your subscription to Ismail Josim’s newsletter',
      type: 'verification',
      status: 'sent',
    });

    return NextResponse.json(
      {
        success: true,
        requiresVerification: true,
        email,
        message: 'Confirmation email sent! Please check your inbox.',
      },
      { status: 200 }
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
