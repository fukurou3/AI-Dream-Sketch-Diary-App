import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GradientButton } from '@/components/GradientButton';
import { VoiceInputButton } from '@/components/VoiceInputButton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useThemedInputStyle, useThemedPlaceholderColor } from '@/hooks/useThemedStyles';
import { useRecordForm } from '@/hooks/useRecordForm';
import { useDreams } from '@/hooks/useDreams';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { THEME_CONSTANTS } from '@/constants/Theme';

export default function RecordScreen() {
  const { t } = useLocalization();
  const [isListening, setIsListening] = useState(false);
  
  const inputStyle = useThemedInputStyle();
  const placeholderColor = useThemedPlaceholderColor();
  const { handleSavingError } = useErrorHandler();
  const { saveDream } = useDreams();
  
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
        Alert.alert('Success', t('dreamSaved'));
        resetForm();
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
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.headerTitle}>
          {t('recordDream')}
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            {t('title')}
          </ThemedText>
          <TextInput
            style={combinedInputStyle}
            value={formData.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder={t('titlePlaceholder')}
            placeholderTextColor={placeholderColor}
          />
          {validation.errors.title && (
            <ThemedText style={styles.errorText}>
              {validation.errors.title}
            </ThemedText>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            {t('content')}
          </ThemedText>
          <TextInput
            style={[combinedInputStyle, styles.contentInput]}
            value={formData.content}
            onChangeText={(value) => updateField('content', value)}
            placeholder={t('dreamPlaceholder')}
            placeholderTextColor={placeholderColor}
            multiline
            textAlignVertical="top"
          />
          {validation.errors.content && (
            <ThemedText style={styles.errorText}>
              {validation.errors.content}
            </ThemedText>
          )}
          <VoiceInputButton
            onVoiceInput={onVoiceInput}
            isListening={isListening}
            style={styles.voiceButton}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            {t('tags')}
          </ThemedText>
          <TextInput
            style={combinedInputStyle}
            value={formData.tags}
            onChangeText={(value) => updateField('tags', value)}
            placeholder={t('tagsPlaceholder')}
            placeholderTextColor={placeholderColor}
          />
          {validation.errors.tags && (
            <ThemedText style={styles.errorText}>
              {validation.errors.tags}
            </ThemedText>
          )}
        </View>

        <GradientButton
          title={isSubmitting ? 'Saving...' : t('save')}
          onPress={onSave}
          disabled={isSubmitting}
          style={styles.saveButton}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME_CONSTANTS.SPACING.LG,
    gap: THEME_CONSTANTS.SPACING.XL,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: THEME_CONSTANTS.SPACING.SM,
  },
  section: {
    gap: THEME_CONSTANTS.SPACING.SM,
  },
  label: {
    marginBottom: THEME_CONSTANTS.SPACING.XS,
  },
  input: {
    padding: THEME_CONSTANTS.SPACING.LG,
    borderRadius: THEME_CONSTANTS.BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    fontSize: 16,
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  voiceButton: {
    alignSelf: 'center',
    marginTop: THEME_CONSTANTS.SPACING.SM,
    paddingHorizontal: THEME_CONSTANTS.SPACING.XXL,
  },
  saveButton: {
    marginTop: THEME_CONSTANTS.SPACING.LG,
    alignSelf: 'stretch',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: THEME_CONSTANTS.SPACING.XS,
  },
});
