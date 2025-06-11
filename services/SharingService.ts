import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Dream } from '@/types/Dream';
import { AIImageResult } from './AIImageGenerator';

export class SharingService {
  static async shareImage(dream: Dream, imageResult: AIImageResult): Promise<boolean> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      // Create a share message
      const shareMessage = this.createShareMessage(dream, imageResult);
      
      // For development, we'll share the image URL
      // In production, you would download and share the actual image file
      await Sharing.shareAsync(imageResult.url, {
        dialogTitle: shareMessage,
        mimeType: 'image/jpeg',
      });

      return true;
    } catch (error) {
      console.error('Error sharing image:', error);
      return false;
    }
  }

  static async saveImageToGallery(imageResult: AIImageResult): Promise<boolean> {
    try {
      // Request permission to access media library
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Permission to access media library was denied');
      }

      // For development, we'll just log the action
      // In production, you would download the image and save it
      console.log('Saving image to gallery:', imageResult.url);
      
      // Create an asset from the image URL
      // const asset = await MediaLibrary.createAssetAsync(localImagePath);
      // await MediaLibrary.createAlbumAsync('Dream Diary', asset, false);

      return true;
    } catch (error) {
      console.error('Error saving image to gallery:', error);
      return false;
    }
  }

  static createShareMessage(dream: Dream, imageResult: AIImageResult): string {
    const dreamTitle = dream.title || 'My Dream';
    const tags = dream.tags.length > 0 ? dream.tags.map(tag => `#${tag}`).join(' ') : '';
    
    return `✨ ${dreamTitle} ✨

${dream.content.substring(0, 100)}${dream.content.length > 100 ? '...' : ''}

Generated with AI Dream Diary 🌙
${tags}

#DreamDiary #AI #Dreams`;
  }

  static async shareText(dream: Dream): Promise<boolean> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      const shareMessage = this.createTextShareMessage(dream);
      
      // Share text content
      await Sharing.shareAsync('', {
        dialogTitle: shareMessage,
      });

      return true;
    } catch (error) {
      console.error('Error sharing text:', error);
      return false;
    }
  }

  private static createTextShareMessage(dream: Dream): string {
    const dreamTitle = dream.title || 'My Dream';
    const tags = dream.tags.length > 0 ? dream.tags.map(tag => `#${tag}`).join(' ') : '';
    const date = dream.createdAt.toLocaleDateString();
    
    return `🌙 ${dreamTitle} (${date})

${dream.content}

${tags}

Recorded with AI Dream Diary ✨
#DreamDiary #Dreams`;
  }

  // Get sharing options based on platform capabilities
  static async getSharingOptions(): Promise<{
    canShare: boolean;
    canSaveToGallery: boolean;
    supportedPlatforms: string[];
  }> {
    const canShare = await Sharing.isAvailableAsync();
    
    // Check media library permission status
    const mediaPermission = await MediaLibrary.getPermissionsAsync();
    
    return {
      canShare,
      canSaveToGallery: mediaPermission.granted || mediaPermission.canAskAgain,
      supportedPlatforms: ['twitter', 'facebook', 'instagram', 'whatsapp', 'email'],
    };
  }
}