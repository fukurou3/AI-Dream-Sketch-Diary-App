import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientButton } from '@/components/GradientButton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { DreamStorage } from '@/services/DreamStorage';
import { Dream } from '@/types/Dream';
import { AIImageGenerator } from '@/services/AIImageGenerator';
import { SharingService } from '@/services/SharingService';
import { useFocusEffect } from '@react-navigation/native';

type ViewMode = 'list' | 'calendar';

function DreamItem({ 
  dream, 
  onGenerateImage,
  isGenerating,
  onShare
}: { 
  dream: Dream; 
  onGenerateImage: (dream: Dream) => void;
  isGenerating: boolean;
  onShare: (dream: Dream) => void;
}) {
  const { t } = useLocalization();
  const colorScheme = useColorScheme() ?? 'light';
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const itemStyle = {
    ...styles.dreamItem,
    backgroundColor: colorScheme === 'dark' ? '#2C2F49' : '#FFFFFF',
    borderColor: colorScheme === 'dark' ? '#404566' : '#E0E0E0',
  };

  return (
    <ThemedView style={itemStyle}>
      <View style={styles.dreamHeader}>
        <ThemedText type="subtitle" style={styles.dreamTitle}>
          {dream.title}
        </ThemedText>
        <ThemedText style={styles.dreamDate}>
          {formatDate(dream.createdAt)}
        </ThemedText>
      </View>
      
      <ThemedText numberOfLines={3} style={styles.dreamContent}>
        {dream.content}
      </ThemedText>
      
      {dream.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {dream.tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: Colors[colorScheme].buttonStart }]}>
              <ThemedText style={styles.tagText}>#{tag}</ThemedText>
            </View>
          ))}
        </View>
      )}
      
      {dream.generatedImages.length > 0 && (
        <View style={styles.imagesContainer}>
          {dream.generatedImages.slice(0, 3).map((image, index) => (
            <View key={index} style={styles.imagePreview}>
              <ThemedText style={styles.imageUrl} numberOfLines={1}>
                🖼️ {image.style} image
              </ThemedText>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <GradientButton
          title={isGenerating ? t('generating') : t('generateImage')}
          onPress={() => onGenerateImage(dream)}
          disabled={isGenerating}
          style={styles.generateButton}
        />
        <GradientButton
          title={t('share')}
          onPress={() => onShare(dream)}
          style={styles.shareButton}
        />
      </View>
    </ThemedView>
  );
}

function EmptyState() {
  const { t } = useLocalization();
  
  return (
    <View style={styles.emptyState}>
      <ThemedText type="title" style={styles.emptyTitle}>
        {t('noDreams')}
      </ThemedText>
      <ThemedText style={styles.emptyDescription}>
        {t('startRecording')}
      </ThemedText>
    </View>
  );
}

export default function DiaryScreen() {
  const { t } = useLocalization();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingDreamId, setGeneratingDreamId] = useState<string | null>(null);

  const loadDreams = async () => {
    try {
      const loadedDreams = await DreamStorage.getAllDreams();
      setDreams(loadedDreams);
    } catch (error) {
      console.error('Error loading dreams:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDreams();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDreams();
  };

  const onShare = async (dream: Dream) => {
    try {
      if (dream.generatedImages.length > 0) {
        // Share the first generated image
        const success = await SharingService.shareImage(dream, dream.generatedImages[0]);
        if (success) {
          Alert.alert('Success', t('sharedSuccessfully'));
        } else {
          Alert.alert('Error', t('sharingFailed'));
        }
      } else {
        // Share as text
        const success = await SharingService.shareText(dream);
        if (success) {
          Alert.alert('Success', t('sharedSuccessfully'));
        } else {
          Alert.alert('Error', t('sharingFailed'));
        }
      }
    } catch (error) {
      console.error('Error sharing dream:', error);
      Alert.alert('Error', t('sharingFailed'));
    }
  };

  const onGenerateImage = async (dream: Dream) => {
    setGeneratingDreamId(dream.id);
    
    try {
      // Check if user has credits (for free tier, this would check ad credits)
      const hasCredits = await AIImageGenerator.checkGenerationCredits();
      
      if (hasCredits === 0) {
        // For free tier, show ad first
        const watchedAd = await AIImageGenerator.watchAdForCredit();
        if (!watchedAd) {
          Alert.alert('Error', 'Please watch the ad to generate an image.');
          return;
        }
      }

      // Generate the image
      const imageResult = await AIImageGenerator.generateImage(dream, {
        style: 'realistic',
        quality: 'standard',
        version: 'free'
      });

      // Save the image to the dream
      await DreamStorage.addImageToDream(dream.id, imageResult);
      
      // Consume the credit
      await AIImageGenerator.consumeCredit();
      
      Alert.alert('Success', t('imageGenerated'));
      
      // Reload dreams to show the new image
      loadDreams();
      
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Error', 'Failed to generate image. Please try again.');
    } finally {
      setGeneratingDreamId(null);
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'calendar' : 'list');
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading dreams...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">{t('diary')}</ThemedText>
        <Pressable onPress={toggleViewMode} style={styles.viewToggle}>
          <ThemedText style={styles.viewToggleText}>
            {viewMode === 'list' ? t('calendarView') : t('listView')}
          </ThemedText>
        </Pressable>
      </View>

      {dreams.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'list' ? (
        <FlatList
          data={dreams}
          keyExtractor={(dream) => dream.id}
          renderItem={({ item }) => (
            <DreamItem 
              dream={item} 
              onGenerateImage={onGenerateImage}
              onShare={onShare}
              isGenerating={generatingDreamId === item.id}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.calendarContainer}>
          <ThemedText>Calendar view coming soon...</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  viewToggle: {
    padding: 8,
  },
  viewToggleText: {
    fontSize: 14,
    opacity: 0.7,
  },
  listContent: { 
    padding: 16,
    paddingTop: 8,
  },
  dreamItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dreamTitle: {
    flex: 1,
    marginRight: 8,
  },
  dreamDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  dreamContent: {
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  generateButton: {
    flex: 1,
    paddingHorizontal: 16,
  },
  shareButton: {
    flex: 1,
    paddingHorizontal: 16,
  },
  imagesContainer: {
    marginBottom: 12,
    gap: 4,
  },
  imagePreview: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  imageUrl: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});
