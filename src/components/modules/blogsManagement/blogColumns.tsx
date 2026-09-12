'use client';

import { Eye, Heart, MessageCircleMore } from 'lucide-react';
import { IBlog } from '../../../types/blog.interface';
import Image from 'next/image';

import { DateCell } from '../../shared/DateCell';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortKey?: string;
}

export const blogColumns: Column<IBlog>[] = [
  {
    header: 'Blog',
    accessor: (blog) => (
      <div className="flex items-center gap-3 min-w-[180px] max-w-[260px]">
        <div className="relative size-10 shrink-0 rounded-md overflow-hidden bg-muted">
          <Image
            src={
              blog.coverImage?.startsWith('blob')
                ? '/placeholder.jpg'
                : blog.coverImage || '/placeholder.jpg'
            }
            alt={blog.title}
            fill
            className="rounded-md object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm truncate" title={blog.title}>
            {blog.title}
          </span>
          <span className="text-xs text-muted-foreground truncate" title={blog.slug}>
            {blog.slug}
          </span>
        </div>
      </div>
    ),
    sortKey: 'title',
  },

  {
    header: 'Category',
    accessor: (blog) => (
      <div className="flex flex-col min-w-[110px] max-w-[160px]">
        <span className="text-sm font-medium">{blog.category}</span>
        <span
          className="text-xs text-muted-foreground truncate"
          title={blog.tags?.join(', ') || ''}
        >
          {blog.tags && blog.tags.length > 0
            ? blog.tags.slice(0, 2).join(', ') +
              (blog.tags.length > 2 ? `, +${blog.tags.length - 2}` : '')
            : 'No tags'}
        </span>
      </div>
    ),
    sortKey: 'category',
  },

  {
    header: 'Engagement',
    accessor: (blog) => (
      <div className="text-xs flex items-center gap-2.5">
        <p className="flex items-center gap-1 text-muted-foreground" title="Views">
          <Eye size={15} />
          <span>{blog.views}</span>
        </p>

        <p className="flex items-center gap-1 text-rose-500" title="Likes">
          <Heart fill="currentColor" size={15} />
          <span>{blog.likesCount}</span>
        </p>

        <p className="flex items-center gap-1 text-accent" title="Comments">
          <MessageCircleMore size={15} />
          <span>{blog.commentsCount}</span>
        </p>
      </div>
    ),
    sortKey: 'engagement',
  },

  {
    header: 'Created',
    accessor: (blog) => <DateCell date={blog.createdAt} />,
    sortKey: 'createdAt',
  },

  {
    header: 'Published',
    accessor: (blog) =>
      blog.publishedAt ? (
        <DateCell date={blog.publishedAt} />
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
    sortKey: 'publishedAt',
  },

  {
    header: 'Status',
    accessor: (blog) => {
      const statusStyles: Record<string, string> = {
        review: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
        scheduled: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
        published: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
        draft: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
        archived: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
      };

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${
            statusStyles[blog.status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30'
          }`}
        >
          {blog.status}
        </span>
      );
    },
    sortKey: 'status',
  },
];
