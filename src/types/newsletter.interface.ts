export type SubscriberStatus = 'active' | 'inactive' | 'pending' | 'blocked';

export interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  isVerified?: boolean;
  subscribedAt: Date | string;
  unsubscribedAt?: Date | string;
  createdAt: Date | string;
  status: SubscriberStatus;
  isBlocked?: boolean;
  blockReason?: string;
  blockedAt?: Date | string;
}

export interface BlockedEmail {
  _id: string;
  email: string;
  reason?: string;
  blockedBy?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Stats {
  totalActive: number;
  totalInactive: number;
  total: number;
  blockedCount: number;
}