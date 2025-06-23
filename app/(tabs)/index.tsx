import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DreamItem } from '@/components/DreamItem';
import { TicketDisplay } from '@/components/TicketDisplay';
import { ModernCard } from '@/components/design/ModernCard';
import { Typography } from '@/components/design/Typography';
import { InstagramGrid } from '@/components/design/InstagramGrid';
import { AnimatedPressable } from '@/components/design/AnimatedPressable';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useDreams } from '@/hooks/useDreams';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { SharingService } from '@/services/SharingService';
import { DESIGN_SYSTEM, getThemeColors } from '@/constants/DesignSystem';
import { Dream } from '@/types/Dream';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';

type ViewMode = 'list' | 'grid' | 'calendar';

function EmptyState() {
  const { t } = useLocalization();
  
  return (
    <ModernCard variant="glass" style={styles.emptyState}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.emptyGradient}
      >
        <Typography variant="h4" align="center" style={styles.emptyTitle}>
          ✨ {t('noDreams')}
        </Typography>
        <Typography variant="body1" color="secondary" align="center" style={styles.emptyDescription}>
          {t('startRecording')}
        </Typography>
        <Typography variant="caption" color="tertiary" align="center" style={styles.emptyHint}>
          記録した夢がここに美しく表示されます
        </Typography>
      </LinearGradient>
    </ModernCard>
  );
}

export default function DiaryScreen() {
  const { t } = useLocalization();
  const colorScheme = useColorScheme();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
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
    setViewMode(current => {
      if (current === 'grid') return 'list';
      if (current === 'list') return 'calendar';
      return 'grid';
    });
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'grid': return '⊞';
      case 'list': return '☰';
      case 'calendar': return '📅';
    }
  };

  const getViewModeText = () => {
    switch (viewMode) {
      case 'grid': return 'Grid';
      case 'list': return 'List';
      case 'calendar': return 'Calendar';
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={DESIGN_SYSTEM.COLORS.GRADIENT.NIGHT}
        style={styles.container}
      >
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ModernCard variant="glass">
            <Typography variant="body1" align="center">✨ Loading dreams...</Typography>
          </ModernCard>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={DESIGN_SYSTEM.COLORS.GRADIENT.NIGHT}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Typography variant="h2" color="primary" weight="BOLD">
            {t('diary')}
          </Typography>
          <Typography variant="body2" color="secondary">
            あなたの夢の世界
          </Typography>
        </View>
        
        <AnimatedPressable onPress={toggleViewMode} style={styles.viewToggle}>
          <ModernCard variant="glass" padding="SM">
            <View style={styles.viewToggleContent}>
              <Typography variant="body2">{getViewModeIcon()}</Typography>
              <Typography variant="caption" color="secondary">
                {getViewModeText()}
              </Typography>
            </View>
          </ModernCard>
        </AnimatedPressable>
      </View>

      <TicketDisplay onTicketUpdate={loadDreams} />

      {dreams.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'grid' ? (
        <InstagramGrid
          data={dreams.filter(dream => dream.generatedImages.length > 0).map(dream => ({
            id: dream.id,
            imageUrl: dream.generatedImages[0]?.url || '',
          }))}
          onItemPress={(item) => {
            const dream = dreams.find(d => d.id === item.id);
            if (dream) {
              // Handle dream item press
              console.log('Dream selected:', dream.title);
            }
          }}
        />
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
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={refreshDreams}
              tintColor={DESIGN_SYSTEM.COLORS.PRIMARY}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ModernCard variant="glass" style={styles.calendarContainer}>
          <Typography variant="h4" align="center">📅</Typography>
          <Typography variant="body1" color="secondary" align="center">
            Calendar view coming soon...
          </Typography>
          <Typography variant="caption" color="tertiary" align="center">
            夢をカレンダー形式で表示する機能を開発中です
          </Typography>
        </ModernCard>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: DESIGN_SYSTEM.SPACING.LG,
    paddingTop: DESIGN_SYSTEM.SPACING.XL,
    paddingBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  headerContent: {
    flex: 1,
  },
  viewToggle: {
    marginLeft: DESIGN_SYSTEM.SPACING.MD,
  },
  viewToggleContent: {
    alignItems: 'center',
    minWidth: 50,
  },
  listContent: { 
    padding: DESIGN_SYSTEM.SPACING.LG,
    paddingTop: DESIGN_SYSTEM.SPACING.SM,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: DESIGN_SYSTEM.SPACING.LG,
    marginVertical: DESIGN_SYSTEM.SPACING.XXXL,
  },
  emptyGradient: {
    padding: DESIGN_SYSTEM.SPACING.XXXL,
    borderRadius: DESIGN_SYSTEM.RADIUS.XL,
    alignItems: 'center',
  },
  emptyTitle: {
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  emptyDescription: {
    marginBottom: DESIGN_SYSTEM.SPACING.SM,
  },
  emptyHint: {
    marginTop: DESIGN_SYSTEM.SPACING.SM,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DESIGN_SYSTEM.SPACING.LG,
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: DESIGN_SYSTEM.SPACING.LG,
    marginVertical: DESIGN_SYSTEM.SPACING.XXXL,
  },
});
