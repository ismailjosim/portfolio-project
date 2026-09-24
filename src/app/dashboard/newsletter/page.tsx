import type { Metadata } from 'next';
import { connectDB } from '../../../lib/mongodb';
import NewsletterSubscriber from '../../../models/NewsletterSubscriber';
import NewsletterDashboard from '@/src/components/modules/newsletter/NewsletterDashboard';

export const metadata: Metadata = {
  title: 'Newsletter Subscribers',
  description: 'Manage newsletter subscribers and view subscription analytics.',
};

const DashboardNewsletterPage = async () => {
  await connectDB();

  const [totalActive, totalInactive, recentSubscribers] = await Promise.all([
    NewsletterSubscriber.countDocuments({ isActive: true }),
    NewsletterSubscriber.countDocuments({ isActive: false }),
    NewsletterSubscriber.find({ isActive: true })
      .select('-unsubscribeToken -__v')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  return (
    <NewsletterDashboard
      stats={{ totalActive, totalInactive, total: totalActive + totalInactive }}
      recentSubscribers={recentSubscribers}
    />
  );
};

export default DashboardNewsletterPage;
