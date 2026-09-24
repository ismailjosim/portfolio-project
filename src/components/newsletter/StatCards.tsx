import { Stats } from '@/src/types/newsletter.interface';
import { Users, UserCheck, UserMinus, Shield, LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
      <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tabular-nums">{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function StatCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      icon: Users,
      label: 'Subscribers',
      value: stats.total,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: UserCheck,
      label: 'Active',
      value: stats.totalActive,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      icon: UserMinus,
      label: 'Unsubscribed',
      value: stats.totalInactive,
      color: 'bg-rose-500/10 text-rose-500',
    },
    {
      icon: Shield,
      label: 'Blocked',
      value: stats.blockedCount,
      color: 'bg-amber-500/10 text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
