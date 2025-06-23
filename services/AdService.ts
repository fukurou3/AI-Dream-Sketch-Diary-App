import { Platform } from 'react-native';

export interface AdProvider {
  showRewardedAd(): Promise<boolean>;
  isAdReady(): Promise<boolean>;
  loadAd(): Promise<void>;
}

// Mock ad service for development
class MockAdService implements AdProvider {
  private adLoaded = false;
  
  async loadAd(): Promise<void> {
    // Simulate ad loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.adLoaded = true;
  }

  async isAdReady(): Promise<boolean> {
    return this.adLoaded;
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.adLoaded) {
      await this.loadAd();
    }

    // Simulate showing ad and user watching it
    return new Promise((resolve) => {
      // Simulate ad duration (5-30 seconds)
      const adDuration = 5000 + Math.random() * 25000;
      
      setTimeout(() => {
        // 90% chance user completes the ad
        const completed = Math.random() > 0.1;
        this.adLoaded = false; // Ad is consumed
        resolve(completed);
      }, adDuration);
    });
  }
}

// Production ad service (to be implemented with real ad SDK)
class ProductionAdService implements AdProvider {
  async loadAd(): Promise<void> {
    // TODO: Implement with Google AdMob, Facebook Audience Network, or other ad SDK
    // Example with AdMob:
    // import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
    // this.rewardedAd = RewardedAd.createForAdRequest('ca-app-pub-xxxxx/xxxxx');
    // await this.rewardedAd.load();
    throw new Error('Production ad service not implemented');
  }

  async isAdReady(): Promise<boolean> {
    // TODO: Check if ad is loaded and ready to show
    return false;
  }

  async showRewardedAd(): Promise<boolean> {
    // TODO: Show the rewarded ad and return whether user completed it
    throw new Error('Production ad service not implemented');
  }
}

export class AdService {
  private static instance: AdProvider;

  static getInstance(): AdProvider {
    if (!AdService.instance) {
      // Use mock service in development, production service in production
      if (__DEV__) {
        AdService.instance = new MockAdService();
      } else {
        AdService.instance = new ProductionAdService();
      }
    }
    return AdService.instance;
  }

  // Preload ad for better user experience
  static async preloadAd(): Promise<void> {
    try {
      const adService = AdService.getInstance();
      await adService.loadAd();
    } catch (error) {
      console.error('Error preloading ad:', error);
    }
  }

  // Show rewarded ad and return whether user completed it
  static async showRewardedAd(): Promise<boolean> {
    try {
      const adService = AdService.getInstance();
      
      // Check if ad is ready
      const isReady = await adService.isAdReady();
      if (!isReady) {
        // Try to load ad if not ready
        await adService.loadAd();
      }

      // Show the ad
      return await adService.showRewardedAd();
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return false;
    }
  }

  // Check if ad is ready to show
  static async isAdReady(): Promise<boolean> {
    try {
      const adService = AdService.getInstance();
      return await adService.isAdReady();
    } catch (error) {
      console.error('Error checking ad readiness:', error);
      return false;
    }
  }
}