import { useState, useCallback } from 'react';
import { Dream, DreamInput } from '@/types/Dream';
import { DreamStorage } from '@/services/DreamStorage';
import { useErrorHandler } from './useErrorHandler';

export interface UseDreamsReturn {
  dreams: Dream[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  loadDreams: () => Promise<void>;
  saveDream: (dreamInput: DreamInput) => Promise<Dream | null>;
  updateDream: (id: string, updates: Partial<Dream>) => Promise<Dream | null>;
  deleteDream: (id: string) => Promise<boolean>;
  refreshDreams: () => Promise<void>;
  clearError: () => void;
}

export const useDreams = (): UseDreamsReturn => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleDreamError } = useErrorHandler();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadDreams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedDreams = await DreamStorage.getAllDreams();
      setDreams(loadedDreams);
    } catch (err) {
      const errorMessage = 'Failed to load dreams';
      setError(errorMessage);
      handleDreamError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleDreamError]);

  const refreshDreams = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const loadedDreams = await DreamStorage.getAllDreams();
      setDreams(loadedDreams);
    } catch (err) {
      const errorMessage = 'Failed to refresh dreams';
      setError(errorMessage);
      handleDreamError(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [handleDreamError]);

  const saveDream = useCallback(async (dreamInput: DreamInput): Promise<Dream | null> => {
    setError(null);
    
    try {
      const newDream = await DreamStorage.saveDream(dreamInput);
      setDreams(prevDreams => [newDream, ...prevDreams]);
      return newDream;
    } catch (err) {
      const errorMessage = 'Failed to save dream';
      setError(errorMessage);
      handleDreamError(err);
      return null;
    }
  }, [handleDreamError]);

  const updateDream = useCallback(async (id: string, updates: Partial<Dream>): Promise<Dream | null> => {
    setError(null);
    
    try {
      const updatedDream = await DreamStorage.updateDream(id, updates);
      if (updatedDream) {
        setDreams(prevDreams => 
          prevDreams.map(dream => 
            dream.id === id ? updatedDream : dream
          )
        );
      }
      return updatedDream;
    } catch (err) {
      const errorMessage = 'Failed to update dream';
      setError(errorMessage);
      handleDreamError(err);
      return null;
    }
  }, [handleDreamError]);

  const deleteDream = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    
    try {
      const success = await DreamStorage.deleteDream(id);
      if (success) {
        setDreams(prevDreams => prevDreams.filter(dream => dream.id !== id));
      }
      return success;
    } catch (err) {
      const errorMessage = 'Failed to delete dream';
      setError(errorMessage);
      handleDreamError(err);
      return false;
    }
  }, [handleDreamError]);

  return {
    dreams,
    isLoading,
    isRefreshing,
    error,
    loadDreams,
    saveDream,
    updateDream,
    deleteDream,
    refreshDreams,
    clearError,
  };
};