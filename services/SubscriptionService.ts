import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription, SubscriptionPlan, UserSubscriptionStatus } from '@/types/Subscription';
import { STORAGE_KEYS } from '@/constants/StorageKeys';

export class SubscriptionService {
  // Predefined subscription plans
  private static readonly SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
      id: 'pro_monthly',
      name: 'Pro Monthly',
      price: 500, // JPY
      currency: 'JPY',
      billingPeriod: 'monthly',
      features: [
        'Unlimited high-quality image generation',
        'AI interviewer for detailed dreams',
        'No ads',
        'Priority support',
        'Exclusive art styles',
        'HD image downloads'
      ],
    },
    {
      id: 'pro_yearly',
      name: 'Pro Yearly',
      price: 5000, // JPY (equivalent to ~10 months)
      currency: 'JPY',
      billingPeriod: 'yearly',
      features: [
        'Unlimited high-quality image generation',
        'AI interviewer for detailed dreams',
        'No ads',
        'Priority support',
        'Exclusive art styles',
        'HD image downloads',
        '2 months free (vs monthly plan)'
      ],
      isPopular: true,
    },
  ];

  // Get current user subscription status
  static async getUserSubscriptionStatus(): Promise<UserSubscriptionStatus> {
    try {
      const subscriptionJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_SUBSCRIPTION);
      
      if (!subscriptionJson) {
        return {
          isPro: false,
          isInTrial: false,
        };
      }

      const subscription: Subscription = JSON.parse(subscriptionJson);
      subscription.startDate = new Date(subscription.startDate);
      if (subscription.endDate) {
        subscription.endDate = new Date(subscription.endDate);
      }

      const now = new Date();
      const isActive = subscription.status === 'active' && 
                      (!subscription.endDate || subscription.endDate > now);
      
      const plan = this.SUBSCRIPTION_PLANS.find(p => 
        p.id === subscription.id || p.name.toLowerCase().includes(subscription.plan)
      );

      return {
        isPro: isActive && subscription.plan === 'pro',
        plan: plan,
        subscription: subscription,
        isInTrial: false, // Can be implemented later
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return {
        isPro: false,
        isInTrial: false,
      };
    }
  }

  // Get available subscription plans
  static getSubscriptionPlans(): SubscriptionPlan[] {
    return [...this.SUBSCRIPTION_PLANS];
  }

  // Subscribe to a plan (mock implementation)
  static async subscribeToPlan(planId: string): Promise<boolean> {
    try {
      const plan = this.SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      const subscription: Subscription = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'user_123', // In real app, get from auth
        plan: 'pro',
        status: 'active',
        startDate: new Date(),
        endDate: plan.billingPeriod === 'monthly' ? 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : 
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        autoRenew: true,
        amount: plan.price,
        currency: plan.currency,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER_SUBSCRIPTION, JSON.stringify(subscription));
      return true;
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      return false;
    }
  }

  // Cancel subscription
  static async cancelSubscription(): Promise<boolean> {
    try {
      const subscriptionJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_SUBSCRIPTION);
      if (!subscriptionJson) {
        return false;
      }

      const subscription: Subscription = JSON.parse(subscriptionJson);
      subscription.status = 'cancelled';
      subscription.autoRenew = false;

      await AsyncStorage.setItem(STORAGE_KEYS.USER_SUBSCRIPTION, JSON.stringify(subscription));
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  // Check if user has pro features
  static async hasProFeatures(): Promise<boolean> {
    const status = await this.getUserSubscriptionStatus();
    return status.isPro;
  }

  // Get user's plan type
  static async getUserPlan(): Promise<'free' | 'pro'> {
    const status = await this.getUserSubscriptionStatus();
    return status.isPro ? 'pro' : 'free';
  }
}