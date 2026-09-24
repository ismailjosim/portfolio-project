import { Schema, Document, Model } from 'mongoose';
import { registerModel } from '../lib/register-model';

export type EmailType = 'newsletter' | 'verification' | 'welcome' | 'contact' | 'system';

export interface ISentEmailLog extends Document {
  recipient: string;
  subject: string;
  type: EmailType;
  status: 'sent' | 'failed';
  error?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SentEmailLogSchema = new Schema<ISentEmailLog>(
  {
    recipient: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['newsletter', 'verification', 'welcome', 'contact', 'system'],
      default: 'newsletter',
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent',
    },
    error: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

SentEmailLogSchema.index({ type: 1 });
SentEmailLogSchema.index({ status: 1 });
SentEmailLogSchema.index({ createdAt: -1 });

const SentEmailLog: Model<ISentEmailLog> = registerModel<ISentEmailLog>(
  'SentEmailLog',
  SentEmailLogSchema
);

export default SentEmailLog;
