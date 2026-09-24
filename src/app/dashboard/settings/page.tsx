import type { Metadata } from 'next';
import SettingsClientView from '@/src/components/modules/settings/SettingsClientView';

export const metadata: Metadata = {
  title: 'Settings — Theme & Typography',
  description:
    'Customize portfolio visual theme, color schemes, Google fonts, and global styling engine.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardSettingsPage() {
  return <SettingsClientView />;
}
