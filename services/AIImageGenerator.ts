import { Dream } from '@/types/Dream';
import { TicketService } from '@/services/TicketService';
import { SubscriptionService } from '@/services/SubscriptionService';

export interface AIImageGenerationOptions {
  style: 'realistic' | 'anime' | 'painting' | 'sketch';
  quality: 'standard' | 'hd';
  version: 'free' | 'pro';
}

export interface AIImageResult {
  url: string;
  prompt: string;
  style: string;
  generatedAt: Date;
  cost?: number;
}

export class AIImageGenerator {
  // Mock data for development
  private static mockImages = [
    'https://picsum.photos/512/512?random=1',
    'https://picsum.photos/512/512?random=2',
    'https://picsum.photos/512/512?random=3',
    'https://picsum.photos/512/512?random=4',
    'https://picsum.photos/512/512?random=5',
  ];

  static async generateImage(
    dream: Dream,
    options: Partial<AIImageGenerationOptions> = {}
  ): Promise<AIImageResult> {
    // Automatically determine version based on subscription
    const isPro = await SubscriptionService.hasProFeatures();
    const actualVersion = isPro ? 'pro' : 'free';
    
    const {
      style = 'realistic',
      quality = isPro ? 'hd' : 'standard',
      version = actualVersion
    } = options;

    // For free version, check and consume ticket
    if (version === 'free') {
      const ticketUsed = await TicketService.useTicket();
      if (!ticketUsed) {
        throw new Error('No tickets available. Please watch an ad or purchase tickets.');
      }
    }

    // Simulate different API delays for different versions
    const baseDelay = version === 'pro' ? 3000 : 2000; // Pro takes longer due to higher quality
    const randomDelay = Math.random() * (version === 'pro' ? 5000 : 3000);
    await new Promise(resolve => setTimeout(resolve, baseDelay + randomDelay));

    // Create a more elaborate prompt based on the dream content
    const enhancedPrompt = this.enhancePrompt(dream, style, version);

    // For development, use a random mock image
    const randomImage = this.mockImages[Math.floor(Math.random() * this.mockImages.length)];

    return {
      url: randomImage,
      prompt: enhancedPrompt,
      style,
      generatedAt: new Date(),
      cost: version === 'free' ? 0.5 : 8.0, // USD cents
    };
  }

  private static enhancePrompt(dream: Dream, style: string, version: 'free' | 'pro'): string {
    let prompt = dream.content;

    if (version === 'free') {
      // Free version: Add dramatic and creative elements for entertainment
      const dramaticElements = [
        'in a surreal dreamscape',
        'with mystical lighting',
        'in an ethereal atmosphere',
        'with magical elements',
        'in a whimsical setting',
        'with dramatic shadows and light',
        'in a fantasy world',
        'with enchanted details',
        'with vibrant colors and dynamic composition',
        'in an artistic interpretation',
      ];
      
      const randomElement = dramaticElements[Math.floor(Math.random() * dramaticElements.length)];
      prompt += ` ${randomElement}`;
    } else {
      // Pro version: Focus on accuracy and detail for faithful reproduction
      prompt += ', highly detailed, photorealistic, accurate representation';
      
      // Add quality modifiers for Pro version
      prompt += ', professional photography quality, sharp focus, perfect lighting';
    }

    // Add style-specific modifiers
    switch (style) {
      case 'anime':
        prompt += ', anime art style, vibrant colors, detailed';
        break;
      case 'painting':
        prompt += ', oil painting style, artistic, painterly';
        break;
      case 'sketch':
        prompt += ', pencil sketch style, black and white, detailed linework';
        break;
      default:
        prompt += ', photorealistic, high detail, cinematic lighting';
    }

    // Add dream-specific tags
    if (dream.tags.length > 0) {
      const tagString = dream.tags.join(', ');
      prompt += `, featuring elements of: ${tagString}`;
    }

    return prompt;
  }

  // Check if user has available generation credits (tickets)
  static async checkGenerationCredits(): Promise<number> {
    const ticketStatus = await TicketService.getUserTicketStatus();
    return ticketStatus.availableTickets;
  }

  // Consume one generation credit (ticket)
  static async consumeCredit(): Promise<boolean> {
    return await TicketService.useTicket();
  }

  // Watch an ad to earn credits (free tier) - deprecated, use TicketService.awardTicketForAd instead
  static async watchAdForCredit(): Promise<boolean> {
    // Redirect to TicketService for consistency
    return await TicketService.awardTicketForAd();
  }

  // Get available styles based on subscription
  static async getAvailableStyles(): Promise<string[]> {
    const isPro = await SubscriptionService.hasProFeatures();
    const baseStyles = ['realistic', 'anime'];
    
    if (isPro) {
      return [...baseStyles, 'painting', 'sketch', 'watercolor', 'digital_art', 'oil_painting', 'watercolor_portrait'];
    }
    
    return baseStyles;
  }

  // Get available styles (sync version for backward compatibility)
  static getAvailableStylesSync(version: 'free' | 'pro' = 'free'): string[] {
    const baseStyles = ['realistic', 'anime'];
    
    if (version === 'pro') {
      return [...baseStyles, 'painting', 'sketch', 'watercolor', 'digital_art', 'oil_painting', 'watercolor_portrait'];
    }
    
    return baseStyles;
  }
}