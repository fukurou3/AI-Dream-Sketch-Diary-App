import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientButton } from '@/components/GradientButton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useThemedCardStyle } from '@/hooks/useThemedStyles';
import { Colors } from '@/constants/Colors';
import { THEME_CONSTANTS } from '@/constants/Theme';
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
    <ThemedView style={itemStyle}>
      <View style={styles.dreamHeader}>
        <ThemedText type="subtitle" style={styles.dreamTitle}>
          {dream.title}
        </ThemedText>
        <ThemedText style={styles.dreamDate}>
          {formatDreamDate(dream.createdAt)}
        </ThemedText>
      </View>
      
      <ThemedText numberOfLines={3} style={styles.dreamContent}>
        {dream.content}
      </ThemedText>
      
      {dream.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {dream.tags.map((tag, index) => (
            <View 
              key={index} 
              style={[
                styles.tag, 
                { backgroundColor: Colors[colorScheme].buttonStart }
              ]}
            >
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

const styles = StyleSheet.create({
  dreamItem: {
    padding: THEME_CONSTANTS.SPACING.LG,
    borderRadius: THEME_CONSTANTS.BORDER_RADIUS.MEDIUM,
    marginBottom: THEME_CONSTANTS.SPACING.MD,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME_CONSTANTS.SPACING.SM,
  },
  dreamTitle: {
    flex: 1,
    marginRight: THEME_CONSTANTS.SPACING.SM,
  },
  dreamDate: {
    fontSize: 12,
    opacity: THEME_CONSTANTS.OPACITY.SECONDARY,
  },
  dreamContent: {
    lineHeight: 20,
    marginBottom: THEME_CONSTANTS.SPACING.MD,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME_CONSTANTS.SPACING.XS,
    marginBottom: THEME_CONSTANTS.SPACING.MD,
  },
  tag: {
    paddingHorizontal: THEME_CONSTANTS.SPACING.SM,
    paddingVertical: THEME_CONSTANTS.SPACING.XS,
    borderRadius: THEME_CONSTANTS.BORDER_RADIUS.MEDIUM,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: THEME_CONSTANTS.SPACING.SM,
    justifyContent: 'space-between',
  },
  generateButton: {
    flex: 1,
    paddingHorizontal: THEME_CONSTANTS.SPACING.LG,
  },
  shareButton: {
    flex: 1,
    paddingHorizontal: THEME_CONSTANTS.SPACING.LG,
  },
  imagesContainer: {
    marginBottom: THEME_CONSTANTS.SPACING.MD,
    gap: THEME_CONSTANTS.SPACING.XS,
  },
  imagePreview: {
    padding: THEME_CONSTANTS.SPACING.SM,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: THEME_CONSTANTS.BORDER_RADIUS.SMALL,
  },
  imageUrl: {
    fontSize: 12,
    opacity: THEME_CONSTANTS.OPACITY.SUBTITLE,
  },
});