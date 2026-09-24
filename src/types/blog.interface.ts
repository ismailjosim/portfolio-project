export interface IBlogTag {
  value: string;
  label: string;
}
export type BlogStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export interface IBlog {
  _id?: string;

  title: string;
  category: string;
  coverImage?: string;
  coverImagePreview?: string;
  tags: string[];
  content: string;
  summary?: string;
  slug?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  publishedAt?: string | Date;
  scheduledPublishDate?: Date | string;
  status: BlogStatus;

  views: number;
  likesCount: number;
  commentsCount: number;

  related?: IBlog[] | string[];
}
