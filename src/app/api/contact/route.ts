import { resend } from '@/src/lib/resend';
import { logEmailSent } from '@/src/lib/email-logger';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    const { error: resendError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Ismail Josim <newsletter@contact.ismailjosim.com>',
      to: 'ismailjosim99@gmail.com',
      subject: `🚀 ${subject || 'New Contact Message'}`,
      replyTo: email,
      html: `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8" />
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background: #0f172a;
                            font-family: Inter, Arial, sans-serif;
                            color: #e2e8f0;
                        }

                        .wrapper {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #111c2e;
                            border: 1px solid #1f2a44;
                            border-radius: 14px;
                            overflow: hidden;
                        }

                        .header {
                            padding: 28px;
                            background: linear-gradient(135deg, #01B4BA, #0ea5e9);
                            text-align: center;
                        }

                        .header h1 {
                            margin: 0;
                            font-size: 22px;
                            color: #ffffff;
                            font-weight: 700;
                            letter-spacing: 1px;
                        }

                        .subtitle {
                            font-size: 12px;
                            opacity: 0.9;
                            margin-top: 6px;
                            color: #e0f7ff;
                        }

                        .content {
                            padding: 28px;
                        }

                        .field {
                            margin-bottom: 18px;
                        }

                        .label {
                            font-size: 11px;
                            text-transform: uppercase;
                            color: #38bdf8;
                            letter-spacing: 1px;
                            margin-bottom: 6px;
                            display: block;
                        }

                        .value {
                            font-size: 15px;
                            color: #e2e8f0;
                            background: #0b1220;
                            padding: 10px 12px;
                            border-radius: 8px;
                            border: 1px solid #1e293b;
                        }

                        .message {
                            background: #0b1220;
                            padding: 14px;
                            border-radius: 10px;
                            border-left: 3px solid #01B4BA;
                            color: #cbd5e1;
                            white-space: pre-wrap;
                        }

                        .footer {
                            text-align: center;
                            font-size: 11px;
                            padding: 16px;
                            color: #64748b;
                            border-top: 1px solid #1e293b;
                        }

                        a {
                            color: #01B4BA;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="header">
                            <h1>New Contact Message</h1>
                            <div class="subtitle">From your portfolio website</div>
                        </div>
                        <div class="content">
                            <div class="field">
                                <span class="label">Name</span>
                                <div class="value">${name}</div>
                            </div>
                            <div class="field">
                                <span class="label">Email</span>
                                <div class="value">
                                    <a href="mailto:${email}">${email}</a>
                                </div>
                            </div>
                            <div class="field">
                                <span class="label">Phone</span>
                                <div class="value">${phone || 'Not provided'}</div>
                            </div>
                            <div class="field">
                                <span class="label">Subject</span>
                                <div class="value">${subject}</div>
                            </div>
                            <div class="field">
                                <span class="label">Message</span>
                                <div class="message">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            Sent from <a href="https://www.ismailjosim.com">ismailjosim.com</a>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    if (resendError) {
      console.error('Resend Error:', resendError);
      await logEmailSent({
        recipient: 'ismailjosim99@gmail.com',
        subject: `🚀 ${subject || 'New Contact Message'}`,
        type: 'contact',
        status: 'failed',
        error: resendError.message,
        metadata: { senderName: name, senderEmail: email, phone },
      });
      return NextResponse.json({ error: 'Email failed to send' }, { status: 500 });
    }

    await logEmailSent({
      recipient: 'ismailjosim99@gmail.com',
      subject: `🚀 ${subject || 'New Contact Message'}`,
      type: 'contact',
      status: 'sent',
      metadata: { senderName: name, senderEmail: email, phone },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend Error:', error);
    await logEmailSent({
      recipient: 'ismailjosim99@gmail.com',
      subject: 'New Contact Message',
      type: 'contact',
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Email failed to send' }, { status: 500 });
  }
}
