import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream, DreamInput } from '@/types/Dream';
import { AIImageResult } from './AIImageGenerator';
import { STORAGE_KEYS } from '@/constants/StorageKeys';
import { logError, AppError } from '@/utils/errorHandler';

export class DreamStorage {
  private static validateDream(dream: any): dream is Dream {
    return (
      typeof dream.id === 'string' &&
      typeof dream.title === 'string' &&
      typeof dream.content === 'string' &&
      Array.isArray(dream.tags) &&
      dream.createdAt &&
      dream.updatedAt
    );
  }

  private static sanitizeDream(dream: any): Dream | null {
    try {
      if (!this.validateDream(dream)) {
        logError('DreamStorage', `Invalid dream data: ${JSON.stringify(dream)}`);
        return null;
      }

      return {
        ...dream,
        createdAt: new Date(dream.createdAt),
        updatedAt: new Date(dream.updatedAt),
        generatedImages: dream.generatedImages?.map((img: any) => ({
          ...img,
          generatedAt: new Date(img.generatedAt),
        })) || [],
      };
    } catch (error) {
      logError('DreamStorage', `Error sanitizing dream: ${error}`);
      return null;
    }
  }

  static async getAllDreams(): Promise<Dream[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DREAMS);
      if (!data) return [];
      
      const rawDreams = JSON.parse(data) as any[];
      const validDreams = rawDreams
        .map(dream => this.sanitizeDream(dream))
        .filter((dream): dream is Dream => dream !== null);

      return validDreams;
    } catch (error) {
      logError('DreamStorage', error);
      throw new AppError('Failed to load dreams', 'LOAD_ERROR', 'DreamStorage.getAllDreams');
    }
  }

  static async saveDream(dreamInput: DreamInput): Promise<Dream> {
    try {
      const dreams = await this.getAllDreams();
      const now = new Date();
      
      const newDream: Dream = {
        id: Date.now().toString(),
        ...dreamInput,
        createdAt: now,
        updatedAt: now,
        generatedImages: [],
        hasGeneratedImage: false,
      };

      dreams.unshift(newDream);
      await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
      
      return newDream;
    } catch (error) {
      logError('DreamStorage', error);
      throw new AppError('Failed to save dream', 'SAVE_ERROR', 'DreamStorage.saveDream');
    }
  }

  static async updateDream(id: string, updates: Partial<Dream>): Promise<Dream | null> {
    try {
      const dreams = await this.getAllDreams();
      const index = dreams.findIndex(dream => dream.id === id);
      
      if (index === -1) {
        logError('DreamStorage', `Dream with id ${id} not found`);
        return null;
      }

      dreams[index] = {
        ...dreams[index],
        ...updates,
        updatedAt: new Date(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
      return dreams[index];
    } catch (error) {
      logError('DreamStorage', error);
      throw new AppError('Failed to update dream', 'UPDATE_ERROR', 'DreamStorage.updateDream');
    }
  }

  static async deleteDream(id: string): Promise<boolean> {
    try {
      const dreams = await this.getAllDreams();
      const originalLength = dreams.length;
      const filteredDreams = dreams.filter(dream => dream.id !== id);
      
      if (filteredDreams.length === originalLength) {
        logError('DreamStorage', `Dream with id ${id} not found for deletion`);
        return false;
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(filteredDreams));
      return true;
    } catch (error) {
      logError('DreamStorage', error);
      throw new AppError('Failed to delete dream', 'DELETE_ERROR', 'DreamStorage.deleteDream');
    }
  }

  static async getDreamById(id: string): Promise<Dream | null> {
    try {
      const dreams = await this.getAllDreams();
      return dreams.find(dream => dream.id === id) || null;
    } catch (error) {
      logError('DreamStorage', error);
      throw new AppError('Failed to get dream by id', 'GET_ERROR', 'DreamStorage.getDreamById');
    }
  }

  static async addImageToDream(dreamId: string, imageResult: AIImageResult): Promise<Dream | null> {
    try {
      const dreams = await this.getAllDreams();
      const dreamIndex = dreams.findIndex(dream => dream.id === dreamId);
      
      if (dreamIndex === -1) {
        logError('DreamStorage', `Dream with id ${dreamId} not found for image addition`);
        return null;
      }

      dreams[dreamIndex].generatedImages.push(imageResult);
      dreams[dreamIndex].hasGeneratedImage = true;
      dreams[dreamIndex].updatedAt = new Date();

      await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
      return dreams[dreamIndex];
    } catch (error) {
      logError('DreamStorage', error);
      throw new AppError('Failed to add image to dream', 'ADD_IMAGE_ERROR', 'DreamStorage.addImageToDream');
    }
  }
}