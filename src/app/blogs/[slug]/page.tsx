import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Heart,
  MessageCircle,
  Calendar,
  Tag,
  Eye,
  ChevronLeft,
  BookOpen,
  FileText,
  Clock,
} from 'lucide-react';

import BlogLikeButton from '@/src/components/blog/BlogLikeButton';
import BlogCommentsSection from '@/src/components/blog/BlogCommentsSection';
import RelatedBlogs from '@/src/components/blog/RelatedBlogs';
import BlogReadingProgress from '@/src/components/blog/BlogReadingProgress';
import BlogShareBar from '@/src/components/blog/BlogShareBar';
import { calculateReadingTime } from '@/src/lib/reading-time';
import { siteConfig } from '@/src/constants/site-config';
import { BreadcrumbJsonLd, BlogPostingJsonLd } from '@/src/components/seo/JsonLd';
import { IBlog } from '@/src/types/blog.interface';

import { formatDateTime } from '@/src/lib/formatters.ts';
import { getSingleBlogBySlug } from '@/src/services/blog-management';
import { Separator } from '@/src/components/ui/separator';

import MarkdownPreview from '@/src/components/blog/MarkdownPreview';
import NewsletterSubscribeBox from '@/src/components/newsletter/NewsletterSubscribeBox';

interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSingleBlogBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: 'Article Not Found',
      description: 'The requested technical article could not be found.',
    };
  }

  const blog = result.data;
  const pageTitle = blog.title;
  const pageDescription =
    blog.summary ||
    (blog.content ? blog.content.slice(0, 160).replace(/[#*`_\[\]]/g, '') : '') ||
    `Read ${blog.title} by ${siteConfig.name}`;

  const ogImages = blog.coverImage
    ? [{ url: blog.coverImage, alt: blog.title }]
    : ['/opengraph-image'];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      blog.category,
      ...(blog.tags || []),
      'Technical Blog',
      'Web Development Tutorial',
      'Software Engineering',
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${siteConfig.url}/blogs/${slug}`,
      type: 'article',
      publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
      modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
      authors: [siteConfig.name],
      tags: blog.tags,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: blog.coverImage ? [blog.coverImage] : ['/opengraph-image'],
    },
  };
}

async function incrementViews(slug: string) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${encodeURIComponent(slug)}/views`, {
      method: 'PATCH',
    });
  } catch (error) {
    console.error('Failed to increment views:', error);
  }
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const result = await getSingleBlogBySlug(slug);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {result.message || 'The blog post you are looking for does not exist.'}
          </p>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const blog = result.data;

  if (blog) {
    await incrementViews(slug);
  }

  return (
    <>
      <BlogReadingProgress />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blogs' },
          { name: blog.title, url: `/blogs/${slug}` },
        ]}
      />
      <BlogPostingJsonLd
        title={blog.title}
        description={blog.summary || blog.title}
        url={`/blogs/${slug}`}
        image={blog.coverImage}
        datePublished={
          blog.publishedAt
            ? new Date(blog.publishedAt).toISOString()
            : new Date(blog.createdAt!).toISOString()
        }
        dateModified={blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined}
        tags={blog.tags}
      />

      {/* Top Breadcrumb */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        <article className="max-w-4xl mx-auto">
          {/* Cover Image */}
          <div className="relative w-full h-60 md:h-96 rounded-2xl overflow-hidden mb-10">
            {blog.coverImage ? (
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-cyan-500 to-blue-600">
                <FileText className="h-16 w-16 text-white/50" />
              </div>
            )}
          </div>

          {/* Category + Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Tag className="w-4 h-4" />
                {blog.category}
              </span>

              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{blog.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={new Date(blog.createdAt!).toISOString()}>
                  {formatDateTime(blog.createdAt!)}
                </time>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{calculateReadingTime(blog.content)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{blog.views + 1} views</span>
              </div>

              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{blog.likesCount} likes</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{blog.commentsCount} comments</span>
              </div>
            </div>
          </div>

          {/* Markdown Content */}
          {/* Content */}
          {blog.content && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Content</h3>
                </div>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <MarkdownPreview content={blog.content} />
                </div>
              </div>
            </>
          )}

          {/* Share Article Bar */}
          <BlogShareBar title={blog.title} slug={slug} />

          {/* Newsletter Subscription Box */}
          <div className="my-10">
            <NewsletterSubscribeBox variant="blog" />
          </div>

          {/* Actions */}
          <div className="border-y py-6 mb-10 flex flex-wrap items-center gap-4">
            <BlogLikeButton blogId={blog._id!} initialCount={blog.likesCount} slug={slug} />

            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border hover:bg-accent/10 transition-colors">
              <MessageCircle className="w-5 h-5" />
              Comment
            </button>
          </div>

          {/* Comments */}
          <BlogCommentsSection
            initialCommentsCount={blog.commentsCount}
            initialLikesCount={blog.likesCount}
            slug={slug}
          />
        </article>

        {/* Related Blogs */}
        <div className="mt-20">
          <RelatedBlogs relatedBlogs={blog.related as IBlog[]} />
        </div>
      </main>
    </>
  );
}
