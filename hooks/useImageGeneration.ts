import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Dream } from '@/types/Dream';
import { AIImageGenerator, AIImageGenerationOptions } from '@/services/AIImageGenerator';
import { DreamStorage } from '@/services/DreamStorage';
import { useErrorHandler } from './useErrorHandler';
import { useLocalization } from '@/contexts/LocalizationContext';
import { TicketService } from '@/services/TicketService';
import { SubscriptionService } from '@/services/SubscriptionService';

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
      // Check subscription status
      const isPro = await SubscriptionService.hasProFeatures();
      
      // For free users, check if they have tickets
      if (!isPro) {
        const ticketStatus = await TicketService.getUserTicketStatus();
        
        if (ticketStatus.availableTickets === 0) {
          Alert.alert(
            t('notEnoughTickets'),
            t('needTicketMessage'),
            [{ text: t('ok'), onPress: () => {} }]
          );
          return false;
        }
      }

      // Generate the image (Pro users don't need tickets, free users will consume a ticket automatically)
      const imageResult = await AIImageGenerator.generateImage(dream, {
        style: 'realistic',
        quality: isPro ? 'hd' : 'standard',
        ...options, // User can override defaults
      });

      // Save the image to the dream
      await DreamStorage.addImageToDream(dream.id, imageResult);
      
      Alert.alert('Success', t('imageGenerated'));
      
      return true;
      
    } catch (error) {
      console.error('Error generating image:', error);
      
      // Check if error is related to tickets
      if (error instanceof Error && error.message.includes('tickets')) {
        Alert.alert(
          t('notEnoughTickets'),
          t('needTicketMessage'),
          [{ text: t('ok'), onPress: () => {} }]
        );
      } else {
        handleImageError(error);
      }
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