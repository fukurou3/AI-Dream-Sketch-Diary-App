import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Dream } from '@/types/Dream';
import { AIImageGenerator, AIImageGenerationOptions } from '@/services/AIImageGenerator';
import { DreamStorage } from '@/services/DreamStorage';
import { useErrorHandler } from './useErrorHandler';
import { useLocalization } from '@/contexts/LocalizationContext';

export interface UseImageGenerationReturn {
  generatingDreamId: string | null;
  isGenerating: boolean;
  generateImage: (dream: Dream, options?: Partial<AIImageGenerationOptions>) => Promise<boolean>;
  checkCredits: () => Promise<number>;
}

export const useImageGeneration = (): UseImageGenerationReturn => {
  const [generatingDreamId, setGeneratingDreamId] = useState<string | null>(null);
  const { handleImageError } = useErrorHandler();
  const { t } = useLocalization();

  const isGenerating = generatingDreamId !== null;

  const checkCredits = useCallback(async (): Promise<number> => {
    try {
      return await AIImageGenerator.checkGenerationCredits();
    } catch (error) {
      handleImageError(error);
      return 0;
    }
  }, [handleImageError]);

  const generateImage = useCallback(async (
    dream: Dream, 
    options: Partial<AIImageGenerationOptions> = {}
  ): Promise<boolean> => {
    if (isGenerating) {
      return false;
    }

    setGeneratingDreamId(dream.id);
    
    try {
      // Check if user has credits (for free tier, this would check ad credits)
      const hasCredits = await AIImageGenerator.checkGenerationCredits();
      
      if (hasCredits === 0) {
        // For free tier, show ad first
        const watchedAd = await AIImageGenerator.watchAdForCredit();
        if (!watchedAd) {
          Alert.alert('Error', 'Please watch the ad to generate an image.');
          return false;
        }
      }

      // Generate the image
      const imageResult = await AIImageGenerator.generateImage(dream, {
        style: 'realistic',
        quality: 'standard',
        version: 'free',
        ...options,
      });

      // Save the image to the dream
      await DreamStorage.addImageToDream(dream.id, imageResult);
      
      // Consume the credit
      await AIImageGenerator.consumeCredit();
      
      Alert.alert('Success', t('imageGenerated'));
      
      return true;
      
    } catch (error) {
      console.error('Error generating image:', error);
      handleImageError(error);
      return false;
    } finally {
      setGeneratingDreamId(null);
    }
  }, [isGenerating, handleImageError, t]);

  return {
    generatingDreamId,
    isGenerating,
    generateImage,
    checkCredits,
  };
};