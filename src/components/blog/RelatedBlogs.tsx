'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IBlog } from '@/src/types/blog.interface';
import { BlogGridSkeleton } from '../shared/PublicDataSkeletons';

interface RelatedBlogsProps {
  currentBlogId: string;
  category: string;
}

export default function RelatedBlogs({ currentBlogId, category }: RelatedBlogsProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs?category=${encodeURIComponent(category)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch related blogs');
        }

        const data = await response.json();
        const blogs = (data.blogs || [])
          .filter((blog: IBlog) => blog._id !== currentBlogId && blog.status === 'published')
          .slice(0, 3);

        setRelatedBlogs(blogs);
      } catch (error) {
        console.error('Failed to fetch related blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [currentBlogId, category]);

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
        <BlogGridSkeleton count={3} />
      </section>
    );
  }

  if (relatedBlogs.length === 0) {
    return null;
  }

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      technology: 'from-blue-500 to-purple-600',
      lifestyle: 'from-green-500 to-teal-600',
      travel: 'from-orange-500 to-red-600',
      finance: 'from-pink-500 to-rose-600',
      learning: 'from-cyan-500 to-blue-600',
      other: 'from-indigo-500 to-purple-600',
    };
    return colors[cat.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {relatedBlogs.map((blog) => (
          <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group">
            <article className="h-full rounded-lg overflow-hidden transition-all border hover:border-accent hover:shadow-lg">
              {blog.coverImage ? (
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div
                  className={`h-48 bg-linear-to-br ${getCategoryColor(blog.category)} flex items-center justify-center`}
                >
                  <FileText className="h-12 w-12 text-white/50" />
                </div>
              )}

              <div className="p-4">
                <p className="text-xs text-accent font-semibold mb-2">{blog.category}</p>
                <h3 className="font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                  {blog.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">
                  {blog.views} views • {blog.likesCount} likes
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
