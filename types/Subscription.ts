export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  amount?: number;
  currency?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscriptionStatus {
  isPro: boolean;
  plan?: SubscriptionPlan;
  subscription?: Subscription;
  trialEndsAt?: Date;
  isInTrial: boolean;
}