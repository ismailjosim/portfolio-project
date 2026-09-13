import { MetadataRoute } from 'next';
import { siteConfig } from '@/src/constants/site-config';
import { connectDB } from '@/src/lib/mongodb';
import Blog from '@/src/models/Blog';
import Project from '@/src/models/project.model';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/all-projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    // Fetch published blogs
    const blogs = await Blog.find({ status: 'published' })
      .select('slug updatedAt publishedAt')
      .lean();

    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Fetch published projects
    const projects = await Project.find({ isPublished: true })
      .select('slug updatedAt createdAt')
      .lean();

    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt || project.createdAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
