import { Alert } from 'react-native';

export const handleServiceError = (error: unknown, fallbackMessage: string): void => {
  console.error('Service error:', error);
  
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  Alert.alert('Error', errorMessage);
};

export const logError = (context: string, error: unknown): void => {
  console.error(`[${context}] Error:`, error);
};

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const createErrorHandler = (context: string) => {
  return (error: unknown, fallbackMessage?: string): void => {
    logError(context, error);
    if (fallbackMessage) {
      handleServiceError(error, fallbackMessage);
    }
  };
};