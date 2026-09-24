import { connectDB } from './mongodb';
import SentEmailLog, { EmailType } from '../models/SentEmailLog';

export async function logEmailSent(params: {
  recipient: string;
  subject: string;
  type: EmailType;
  status?: 'sent' | 'failed';
  error?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await connectDB();
    await SentEmailLog.create({
      recipient: params.recipient.toLowerCase(),
      subject: params.subject,
      type: params.type,
      status: params.status || 'sent',
      error: params.error,
      metadata: params.metadata,
    });
  } catch (err) {
    console.error('[logEmailSent failed]', err);
  }
}
