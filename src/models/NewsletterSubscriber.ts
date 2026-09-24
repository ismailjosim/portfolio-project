import { Schema, Document, Model } from 'mongoose';
import { registerModel } from '../lib/register-model';

export interface INewsletterSubscriber extends Document {
  email: string;
  name?: string;
  isActive: boolean;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  unsubscribeToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    unsubscribeToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

NewsletterSubscriberSchema.index({ email: 1 });
NewsletterSubscriberSchema.index({ isActive: 1 });
NewsletterSubscriberSchema.index({ isVerified: 1 });
NewsletterSubscriberSchema.index({ verificationToken: 1 });
NewsletterSubscriberSchema.index({ unsubscribeToken: 1 });

const NewsletterSubscriber: Model<INewsletterSubscriber> = registerModel<INewsletterSubscriber>(
  'NewsletterSubscriber',
  NewsletterSubscriberSchema
);

export default NewsletterSubscriber;
