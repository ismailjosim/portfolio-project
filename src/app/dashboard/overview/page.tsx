import type { Metadata } from 'next';
import { getDashboardData } from '@/src/services/dashboard.service';
import { DashboardOverview } from '@/src/components/dashboard/DashboardOverview';

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Portfolio analytics, visitor metrics, and administrative statistics.',
};

export default async function OverviewPage() {
  const data = await getDashboardData();

  return (
    <div className="w-full">
      <DashboardOverview data={data} />
    </div>
  );
}
