'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Stats } from '@/src/types/newsletter.interface';
import { Users, UserCheck, UserMinus, Shield, LucideIcon } from 'lucide-react';

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  badgeBg: string;
  statusKey: string | null;
}

export function NewsletterStatCards({ stats }: { stats: Stats }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentStatus = searchParams.get('status') || 'all';

  const handleCardClick = (statusKey: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!statusKey || statusKey === 'all') {
      params.delete('status');
    } else {
      params.set('status', statusKey);
    }
    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const cards: StatItem[] = [
    {
      icon: Users,
      label: 'Total Subscribers',
      value: stats.total,
      color: 'text-blue-500',
      badgeBg: 'bg-blue-500/10',
      statusKey: 'all',
    },
    {
      icon: UserCheck,
      label: 'Active',
      value: stats.totalActive,
      color: 'text-emerald-500',
      badgeBg: 'bg-emerald-500/10',
      statusKey: 'active',
    },
    {
      icon: UserMinus,
      label: 'Unsubscribed',
      value: stats.totalInactive,
      color: 'text-rose-500',
      badgeBg: 'bg-rose-500/10',
      statusKey: 'inactive',
    },
    {
      icon: Shield,
      label: 'Blocked',
      value: stats.blockedCount,
      color: 'text-amber-500',
      badgeBg: 'bg-amber-500/10',
      statusKey: 'blocked',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected =
          (card.statusKey === 'all' && currentStatus === 'all') ||
          card.statusKey === currentStatus;

        return (
          <button
            key={card.label}
            type="button"
            onClick={() => handleCardClick(card.statusKey)}
            className={`text-left rounded-xl border p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-card border-primary/50 shadow-sm ring-1 ring-primary/20'
                : 'bg-card/60 border-border/80 hover:bg-card hover:border-border shadow-xs'
            }`}
          >
            <div
              className={`flex items-center justify-center size-10 sm:size-11 rounded-lg shrink-0 ${card.badgeBg} ${card.color}`}
            >
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums truncate">
                {card.value.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{card.label}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default NewsletterStatCards;
