import { Dream } from '@/types/Dream';

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
    const {
      style = 'realistic',
      quality = 'standard',
      version = 'free'
    } = options;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

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
      // Free version: Add dramatic and creative elements
      const dramaticElements = [
        'in a surreal dreamscape',
        'with mystical lighting',
        'in an ethereal atmosphere',
        'with magical elements',
        'in a whimsical setting',
        'with dramatic shadows and light',
        'in a fantasy world',
        'with enchanted details',
      ];
      
      const randomElement = dramaticElements[Math.floor(Math.random() * dramaticElements.length)];
      prompt += ` ${randomElement}`;
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

  // Check if user has available generation credits
  static async checkGenerationCredits(): Promise<number> {
    // For development, return a mock number
    // In production, this would check the user's subscription status or ad credits
    return Math.floor(Math.random() * 5) + 1;
  }

  // Consume one generation credit
  static async consumeCredit(): Promise<boolean> {
    // For development, always succeed
    // In production, this would decrement the user's credits
    return true;
  }

  // Watch an ad to earn credits (free tier)
  static async watchAdForCredit(): Promise<boolean> {
    // Simulate watching an ad
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For development, always succeed
    // In production, this would show a real ad and verify completion
    return true;
  }

  // Get available styles
  static getAvailableStyles(version: 'free' | 'pro' = 'free'): string[] {
    const baseStyles = ['realistic', 'anime'];
    
    if (version === 'pro') {
      return [...baseStyles, 'painting', 'sketch', 'watercolor', 'digital_art'];
    }
    
    return baseStyles;
  }
}