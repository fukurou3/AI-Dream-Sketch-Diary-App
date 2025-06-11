import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream, DreamInput } from '@/types/Dream';
import { AIImageResult } from './AIImageGenerator';

const DREAMS_KEY = 'dreams';

export class DreamStorage {
  static async getAllDreams(): Promise<Dream[]> {
    try {
      const data = await AsyncStorage.getItem(DREAMS_KEY);
      if (!data) return [];
      
      const dreams = JSON.parse(data) as Dream[];
      return dreams.map(dream => ({
        ...dream,
        createdAt: new Date(dream.createdAt),
        updatedAt: new Date(dream.updatedAt),
        generatedImages: dream.generatedImages?.map(img => ({
          ...img,
          generatedAt: new Date(img.generatedAt),
        })) || [],
      }));
    } catch (error) {
      console.error('Error loading dreams:', error);
      return [];
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
      await AsyncStorage.setItem(DREAMS_KEY, JSON.stringify(dreams));
      
      return newDream;
    } catch (error) {
      console.error('Error saving dream:', error);
      throw error;
    }
  }

  static async updateDream(id: string, updates: Partial<Dream>): Promise<Dream | null> {
    try {
      const dreams = await this.getAllDreams();
      const index = dreams.findIndex(dream => dream.id === id);
      
      if (index === -1) return null;

      dreams[index] = {
        ...dreams[index],
        ...updates,
        updatedAt: new Date(),
      };

      await AsyncStorage.setItem(DREAMS_KEY, JSON.stringify(dreams));
      return dreams[index];
    } catch (error) {
      console.error('Error updating dream:', error);
      throw error;
    }
  }

  static async deleteDream(id: string): Promise<boolean> {
    try {
      const dreams = await this.getAllDreams();
      const filteredDreams = dreams.filter(dream => dream.id !== id);
      
      await AsyncStorage.setItem(DREAMS_KEY, JSON.stringify(filteredDreams));
      return true;
    } catch (error) {
      console.error('Error deleting dream:', error);
      return false;
    }
  }

  static async getDreamById(id: string): Promise<Dream | null> {
    try {
      const dreams = await this.getAllDreams();
      return dreams.find(dream => dream.id === id) || null;
    } catch (error) {
      console.error('Error getting dream by id:', error);
      return null;
    }
  }

  static async addImageToDream(dreamId: string, imageResult: AIImageResult): Promise<Dream | null> {
    try {
      const dreams = await this.getAllDreams();
      const dreamIndex = dreams.findIndex(dream => dream.id === dreamId);
      
      if (dreamIndex === -1) return null;

      // Serialize the image result to handle Date objects
      const serializedImageResult = {
        ...imageResult,
        generatedAt: imageResult.generatedAt.toISOString(),
      };

      dreams[dreamIndex].generatedImages.push(imageResult);
      dreams[dreamIndex].hasGeneratedImage = true;
      dreams[dreamIndex].updatedAt = new Date();

      await AsyncStorage.setItem(DREAMS_KEY, JSON.stringify(dreams));
      return dreams[dreamIndex];
    } catch (error) {
      console.error('Error adding image to dream:', error);
      throw error;
    }
  }
}