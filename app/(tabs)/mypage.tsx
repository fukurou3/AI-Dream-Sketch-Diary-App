import React, { useCallback } from 'react';
import { StyleSheet, View, StatusBar, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { ModernCard } from '@/components/design/ModernCard';
import { Typography } from '@/components/design/Typography';
import { InstagramGrid } from '@/components/design/InstagramGrid';
import { InstagramGridSkeleton } from '@/components/design/InstagramGridSkeleton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useDreams } from '@/hooks/useDreams';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';
import { formatDreamDate } from '@/utils/dateUtils';

function EmptyState() {
  const { t } = useLocalization();
  
  return (
    <ModernCard variant="glass" style={styles.emptyState}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.emptyGradient}
      >
        <Typography variant="h4" align="center" style={styles.emptyTitle}>
          ✨ {t('noImagesYet')}
        </Typography>
        <Typography variant="body1" color="secondary" align="center" style={styles.emptyDescription}>
          {t('recordDreamsToGenerateImages')}
        </Typography>
        <Typography variant="caption" color="tertiary" align="center" style={styles.emptyHint}>
          夢を記録してAIにスケッチしてもらいましょう
        </Typography>
      </LinearGradient>
    </ModernCard>
  );
}

export default function MyPageScreen() {
  const { t } = useLocalization();
  const { dreams, isLoading, isRefreshing, loadDreams, refreshDreams } = useDreams();

  useFocusEffect(
    useCallback(() => {
      loadDreams();
    }, [loadDreams])
  );

  const imagesForGrid = dreams
    .filter(dream => dream.generatedImages.length > 0)
    .map(dream => ({
      id: dream.id,
      imageUrl: dream.generatedImages[0]?.url || '',
      date: formatDreamDate(dream.createdAt, 'short'), // Add date for display
    }));

  return (
    <LinearGradient
      colors={DESIGN_SYSTEM.COLORS.GRADIENT.NIGHT}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Typography variant="h2" color="primary" weight="BOLD">
          {t('myPage')}
        </Typography>
        <Typography variant="body2" color="secondary">
          あなたの夢のギャラリー
        </Typography>
      </View>

      {isLoading && !isRefreshing ? (
        <InstagramGridSkeleton />
      ) : imagesForGrid.length === 0 ? (
        <EmptyState />
      ) : (
        <InstagramGrid
          data={imagesForGrid}
          onItemPress={(item) => {
            console.log('Image selected:', item.id, item.date);
            // TODO: Implement navigation to dream detail screen
          }}
          renderItemOverlay={({ date }) => (
            <View style={styles.dateOverlay}>
              <Typography variant="caption" weight="BOLD" color="white">
                {date}
              </Typography>
            </View>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={refreshDreams}
              tintColor={DESIGN_SYSTEM.COLORS.PRIMARY}
            />
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: DESIGN_SYSTEM.SPACING.LG,
    paddingTop: DESIGN_SYSTEM.SPACING.XL,
    paddingBottom: DESIGN_SYSTEM.SPACING.MD,
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
  dateOverlay: {
    position: 'absolute',
    bottom: DESIGN_SYSTEM.SPACING.XS,
    left: DESIGN_SYSTEM.SPACING.XS,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: DESIGN_SYSTEM.RADIUS.SM,
    paddingHorizontal: DESIGN_SYSTEM.SPACING.SM,
    paddingVertical: DESIGN_SYSTEM.SPACING.XS,
  },
});
