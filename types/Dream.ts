import { AIImageResult } from '@/services/AIImageGenerator';

export interface Dream {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  generatedImages: AIImageResult[];
  hasGeneratedImage: boolean;
}

export interface DreamInput {
  title: string;
  content: string;
  tags: string[];
}