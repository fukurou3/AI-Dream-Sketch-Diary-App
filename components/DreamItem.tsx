import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientButton } from '@/components/GradientButton';
import { ModernCard } from '@/components/design/ModernCard';
import { Typography } from '@/components/design/Typography';
import { ModernButton } from '@/components/design/ModernButton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useThemedCardStyle } from '@/hooks/useThemedStyles';
import { Colors } from '@/constants/Colors';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';
import { Dream } from '@/types/Dream';
import { formatDreamDate } from '@/utils/dateUtils';
import { useColorScheme } from '@/hooks/useColorScheme';

interface DreamItemProps {
  dream: Dream;
  onGenerateImage: (dream: Dream) => void;
  onShare: (dream: Dream) => void;
  isGenerating: boolean;
}

export function DreamItem({ 
  dream, 
  onGenerateImage,
  onShare,
  isGenerating 
}: DreamItemProps) {
  const { t } = useLocalization();
  const colorScheme = useColorScheme() ?? 'light';
  const cardStyle = useThemedCardStyle();

  const itemStyle = {
    ...styles.dreamItem,
    ...cardStyle,
    borderWidth: 1,
  };

  return (
    <ModernCard variant="elevated" style={styles.dreamItem}>
      <View style={styles.dreamHeader}>
        <Typography variant="h5" weight="SEMIBOLD" style={styles.dreamTitle}>
          {dream.title}
        </Typography>
        <Typography variant="caption" color="secondary" style={styles.dreamDate}>
          {formatDreamDate(dream.createdAt)}
        </Typography>
      </View>
      
      <Typography variant="body1" numberOfLines={3} style={styles.dreamContent}>
        {dream.content}
      </Typography>
      
      {dream.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {dream.tags.map((tag, index) => (
            <ModernCard 
              key={index} 
              variant="glass"
              padding="XS"
              radius="ROUND"
              style={styles.tag}
            >
              <Typography variant="caption" color="accent">#{tag}</Typography>
            </ModernCard>
          ))}
        </View>
      )}
      
      {dream.generatedImages.length > 0 && (
        <View style={styles.imagesContainer}>
          {dream.generatedImages.slice(0, 3).map((image, index) => (
            <ModernCard key={index} variant="glass" padding="SM" style={styles.imagePreview}>
              <Typography variant="caption" numberOfLines={1}>
                🖼️ {image.style} image
              </Typography>
            </ModernCard>
          ))}
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <ModernButton
          title={isGenerating ? t('generating') : `✨ ${t('generateImage')}`}
          onPress={() => onGenerateImage(dream)}
          disabled={isGenerating}
          variant="gradient"
          size="MD"
          style={styles.generateButton}
        />
        <ModernButton
          title={`📤 ${t('share')}`}
          onPress={() => onShare(dream)}
          variant="outline"
          size="MD"
          style={styles.shareButton}
        />
      </View>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  dreamItem: {
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DESIGN_SYSTEM.SPACING.SM,
  },
  dreamTitle: {
    flex: 1,
    marginRight: DESIGN_SYSTEM.SPACING.SM,
  },
  dreamDate: {
    // Typography component handles styling
  },
  dreamContent: {
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DESIGN_SYSTEM.SPACING.XS,
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  tag: {
    // ModernCard handles padding and styling
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.SPACING.SM,
    justifyContent: 'space-between',
  },
  generateButton: {
    flex: 1,
  },
  shareButton: {
    flex: 1,
  },
  imagesContainer: {
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
    gap: DESIGN_SYSTEM.SPACING.XS,
  },
  imagePreview: {
    // ModernCard handles styling
  },
  imageUrl: {
    // Typography component handles styling
  },
});