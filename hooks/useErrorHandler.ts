import { useCallback } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { handleServiceError, createErrorHandler } from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const { t } = useLocalization();
  
  const handleDreamError = useCallback((error: unknown) => 
    handleServiceError(error, 'Failed to manage dream. Please try again.'), []);
  
  const handleImageError = useCallback((error: unknown) => 
    handleServiceError(error, t('generationFailed')), [t]);
  
  const handleSharingError = useCallback((error: unknown) => 
    handleServiceError(error, t('sharingFailed')), [t]);
  
  const handleSavingError = useCallback((error: unknown) => 
    handleServiceError(error, 'Failed to save. Please try again.'), []);
  
  const handleLoadingError = useCallback((error: unknown) => 
    handleServiceError(error, 'Failed to load data. Please try again.'), []);
  
  const createContextHandler = useCallback((context: string) => 
    createErrorHandler(context), []);
  
  return {
    handleDreamError,
    handleImageError,
    handleSharingError,
    handleSavingError,
    handleLoadingError,
    createContextHandler,
  };
};