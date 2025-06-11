import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DreamItem } from '@/components/DreamItem';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useDreams } from '@/hooks/useDreams';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { SharingService } from '@/services/SharingService';
import { THEME_CONSTANTS } from '@/constants/Theme';
import { Dream } from '@/types/Dream';
import { useFocusEffect } from '@react-navigation/native';

type ViewMode = 'list' | 'calendar';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { handleSharingError } = useErrorHandler();
  
  const { 
    dreams, 
    isLoading, 
    isRefreshing, 
    loadDreams, 
    refreshDreams 
  } = useDreams();
  
  const { 
    generatingDreamId, 
    generateImage 
  } = useImageGeneration();

  useFocusEffect(
    useCallback(() => {
      loadDreams();
    }, [loadDreams])
  );

  const onShare = useCallback(async (dream: Dream) => {
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
      handleSharingError(error);
    }
  }, [t, handleSharingError]);

  const onGenerateImage = useCallback(async (dream: Dream) => {
    const success = await generateImage(dream);
    if (success) {
      // Reload dreams to show the new image
      loadDreams();
    }
  }, [generateImage, loadDreams]);

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
            <RefreshControl refreshing={isRefreshing} onRefresh={refreshDreams} />
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
    padding: THEME_CONSTANTS.SPACING.LG,
    paddingBottom: THEME_CONSTANTS.SPACING.SM,
  },
  viewToggle: {
    padding: THEME_CONSTANTS.SPACING.SM,
  },
  viewToggleText: {
    fontSize: 14,
    opacity: THEME_CONSTANTS.OPACITY.SUBTITLE,
  },
  listContent: { 
    padding: THEME_CONSTANTS.SPACING.LG,
    paddingTop: THEME_CONSTANTS.SPACING.SM,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME_CONSTANTS.SPACING.XXXL,
  },
  emptyTitle: {
    marginBottom: THEME_CONSTANTS.SPACING.SM,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: THEME_CONSTANTS.OPACITY.SUBTITLE,
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
    padding: THEME_CONSTANTS.SPACING.XXXL,
  },
});
