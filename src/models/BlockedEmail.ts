import { Schema, Document, Model } from 'mongoose';
import { registerModel } from '../lib/register-model';

export interface IBlockedEmail extends Document {
  email: string;
  reason?: string;
  blockedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockedEmailSchema = new Schema<IBlockedEmail>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [200, 'Reason cannot exceed 200 characters'],
    },
    blockedBy: {
      type: String,
      trim: true,
      default: 'admin',
    },
  },
  { timestamps: true }
);

BlockedEmailSchema.index({ email: 1 });

const BlockedEmail: Model<IBlockedEmail> = registerModel<IBlockedEmail>(
  'BlockedEmail',
  BlockedEmailSchema
);

export default BlockedEmail;
