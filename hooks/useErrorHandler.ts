import { useLocalization } from '@/contexts/LocalizationContext';
import { handleServiceError, createErrorHandler } from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const { t } = useLocalization();
  
  return {
    handleDreamError: (error: unknown) => 
      handleServiceError(error, 'Failed to manage dream. Please try again.'),
    
    handleImageError: (error: unknown) => 
      handleServiceError(error, t('generationFailed')),
    
    handleSharingError: (error: unknown) => 
      handleServiceError(error, t('sharingFailed')),
    
    handleSavingError: (error: unknown) => 
      handleServiceError(error, 'Failed to save. Please try again.'),
    
    handleLoadingError: (error: unknown) => 
      handleServiceError(error, 'Failed to load data. Please try again.'),
    
    createContextHandler: (context: string) => createErrorHandler(context),
  };
};