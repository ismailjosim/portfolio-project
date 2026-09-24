import { Schema, Document, Model } from 'mongoose';
import { registerModel } from '../lib/register-model';

export interface INewsletterTemplate extends Document {
  subject: string;
  content: string;
  html?: string;
  recipientCount: number;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterTemplateSchema = new Schema<INewsletterTemplate>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    html: {
      type: String,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

NewsletterTemplateSchema.index({ sentAt: -1 });
NewsletterTemplateSchema.index({ createdAt: -1 });

const NewsletterTemplate: Model<INewsletterTemplate> = registerModel<INewsletterTemplate>(
  'NewsletterTemplate',
  NewsletterTemplateSchema
);

export default NewsletterTemplate;
