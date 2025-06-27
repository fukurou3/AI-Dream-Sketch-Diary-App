import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, View, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GradientButton } from '@/components/GradientButton';
import { VoiceInputButton } from '@/components/VoiceInputButton';
import { ModernCard } from '@/components/design/ModernCard';
import { Typography } from '@/components/design/Typography';
import { ModernButton } from '@/components/design/ModernButton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useThemedInputStyle, useThemedPlaceholderColor } from '@/hooks/useThemedStyles';
import { useRecordForm } from '@/hooks/useRecordForm';
import { useDreams } from '@/hooks/useDreams';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { DESIGN_SYSTEM, getThemeColors } from '@/constants/DesignSystem';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RecordScreen() {
  const { t } = useLocalization();
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  const [isListening, setIsListening] = useState(false);
  const navigation = useNavigation();
  
  const inputStyle = useThemedInputStyle();
  const placeholderColor = useThemedPlaceholderColor();
  const { handleSavingError } = useErrorHandler();
  const { saveDream } = useDreams();
  const { generateImage } = useImageGeneration();
  
  const {
    formData,
    validation,
    isSubmitting,
    updateField,
    resetForm,
    validateForm,
    toDreamInput,
  } = useRecordForm();

  const onVoiceInput = async () => {
    setIsListening(true);
    try {
      // Note: Expo Speech is primarily for text-to-speech
      // For speech-to-text, we would need expo-speech-recognition or similar
      // For now, we'll simulate voice input
      setTimeout(() => {
        const newContent = formData.content + (formData.content ? ' ' : '') + '[Voice input would go here]';
        updateField('content', newContent);
        setIsListening(false);
      }, 2000);
    } catch (error) {
      console.error('Voice input error:', error);
      setIsListening(false);
    }
  };

  const onSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const dreamInput = toDreamInput();
      const savedDream = await saveDream(dreamInput);
      
      if (savedDream) {
        // Immediately start image generation
        generateImage(savedDream);

        Alert.alert(
          t('dreamSaved'),
          'AIがあなたの夢のスケッチを始めました！🎨 完成をお楽しみに。',
          [
            {
              text: '日記を見る',
              onPress: () => {
                resetForm();
                navigation.navigate('index');
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      handleSavingError(error);
    }
  };

  const combinedInputStyle = {
    ...styles.input,
    ...inputStyle,
  };

  return (
    <LinearGradient
      colors={DESIGN_SYSTEM.COLORS.GRADIENT.DREAM}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Typography variant="h2" color="primary" weight="BOLD" align="center">
            ✨ {t('recordDream')}
          </Typography>
          <Typography variant="body1" color="secondary" align="center" style={styles.subtitle}>
            あなたの夢を記録しましょう
          </Typography>
        </View>

        <ModernCard variant="glass" style={styles.formCard}>
          <View style={styles.section}>
            <Typography variant="h6" weight="MEDIUM" style={styles.label}>
              {t('title')}
            </Typography>
            <TextInput
              style={[styles.input, { 
                backgroundColor: themeColors.SURFACE,
                borderColor: themeColors.BORDER,
                color: themeColors.TEXT_PRIMARY
              }]}
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder={t('titlePlaceholder')}
              placeholderTextColor={themeColors.TEXT_SECONDARY}
            />
            {validation.errors.title && (
              <Typography variant="caption" color="error" style={styles.errorText}>
                {validation.errors.title}
              </Typography>
            )}
          </View>

          <View style={styles.section}>
            <Typography variant="h6" weight="MEDIUM" style={styles.label}>
              {t('content')}
            </Typography>
            <TextInput
              style={[styles.input, styles.contentInput, { 
                backgroundColor: themeColors.SURFACE,
                borderColor: themeColors.BORDER,
                color: themeColors.TEXT_PRIMARY
              }]}
              value={formData.content}
              onChangeText={(value) => updateField('content', value)}
              placeholder={t('dreamPlaceholder')}
              placeholderTextColor={themeColors.TEXT_SECONDARY}
              multiline
              textAlignVertical="top"
            />
            {validation.errors.content && (
              <Typography variant="caption" color="error" style={styles.errorText}>
                {validation.errors.content}
              </Typography>
            )}
            <VoiceInputButton
              onVoiceInput={onVoiceInput}
              isListening={isListening}
              style={styles.voiceButton}
            />
          </View>

          <View style={styles.section}>
            <Typography variant="h6" weight="MEDIUM" style={styles.label}>
              {t('tags')}
            </Typography>
            <TextInput
              style={[styles.input, { 
                backgroundColor: themeColors.SURFACE,
                borderColor: themeColors.BORDER,
                color: themeColors.TEXT_PRIMARY
              }]}
              value={formData.tags}
              onChangeText={(value) => updateField('tags', value)}
              placeholder={t('tagsPlaceholder')}
              placeholderTextColor={themeColors.TEXT_SECONDARY}
            />
            {validation.errors.tags && (
              <Typography variant="caption" color="error" style={styles.errorText}>
                {validation.errors.tags}
              </Typography>
            )}
          </View>

          <ModernButton
            title={isSubmitting ? '💾 Saving...' : `💾 ${t('save')}`}
            onPress={onSave}
            disabled={isSubmitting}
            variant="gradient"
            size="LG"
            style={styles.saveButton}
          />
        </ModernCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: DESIGN_SYSTEM.SPACING.LG,
  },
  header: {
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.SPACING.XL,
    paddingTop: DESIGN_SYSTEM.SPACING.XL,
  },
  subtitle: {
    marginTop: DESIGN_SYSTEM.SPACING.SM,
  },
  formCard: {
    marginBottom: DESIGN_SYSTEM.SPACING.XL,
  },
  section: {
    gap: DESIGN_SYSTEM.SPACING.SM,
    marginBottom: DESIGN_SYSTEM.SPACING.LG,
  },
  label: {
    marginBottom: DESIGN_SYSTEM.SPACING.XS,
  },
  input: {
    padding: DESIGN_SYSTEM.SPACING.LG,
    borderRadius: DESIGN_SYSTEM.RADIUS.MD,
    borderWidth: 1.5,
    fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.MD,
    fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.REGULAR,
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  voiceButton: {
    alignSelf: 'center',
    marginTop: DESIGN_SYSTEM.SPACING.SM,
  },
  saveButton: {
    marginTop: DESIGN_SYSTEM.SPACING.LG,
  },
  errorText: {
    marginTop: DESIGN_SYSTEM.SPACING.XS,
  },
});
