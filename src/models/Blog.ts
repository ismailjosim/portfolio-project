import { Schema, Document, Model } from 'mongoose';
import { registerModel } from '../lib/register-model';

export interface IBlog extends Document {
  title: string;
  category: string;
  coverImage?: string;
  tags: string[];
  content: string;
  summary?: string;
  slug: string;
  status: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  scheduledPublishDate?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  related?: string[];
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      minlength: [2, 'Category must be at least 2 characters'],
      maxlength: [60, 'Category cannot exceed 60 characters'],
    },
    coverImage: { type: String },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 10,
        message: 'A blog post cannot have more than 10 tags',
      },
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must be lowercase letters, numbers, and hyphens only (e.g. my-blog-post)',
      ],
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'scheduled', 'published', 'archived'],
      default: 'draft',
    },
    scheduledPublishDate: { type: Date },
    // Stamped only when the post transitions into `published`. Unlike `updatedAt`,
    // this is not disturbed by the view/like/comment counters, so it is the only
    // safe field to order the public blog list by.
    publishedAt: { type: Date },
    views: { type: Number, default: 0, min: [0, 'Views cannot be negative'] },
    likesCount: {
      type: Number,
      default: 0,
      min: [0, 'Likes count cannot be negative'],
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: [0, 'Comments count cannot be negative'],
    },
    related: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
  },
  { timestamps: true }
);

BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });
// Backs the public list query: filter on status, order by publishedAt.
BlogSchema.index({ status: 1, publishedAt: -1 });

const Blog: Model<IBlog> = registerModel<IBlog>('Blog', BlogSchema);

export default Blog;
