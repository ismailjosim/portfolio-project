import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomIcon extends Document {
  name: string;
  url: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomIconSchema = new Schema<ICustomIcon>(
  {
    name: {
      type: String,
      required: [true, 'Icon name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    url: {
      type: String,
      required: [true, 'Icon URL is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      default: 'frontend',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.CustomIcon as mongoose.Model<ICustomIcon>) ||
  mongoose.model<ICustomIcon>('CustomIcon', CustomIconSchema);
