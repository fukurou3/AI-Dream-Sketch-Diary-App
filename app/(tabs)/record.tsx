import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GradientButton } from '@/components/GradientButton';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { DreamStorage } from '@/services/DreamStorage';

export default function RecordScreen() {
  const { t } = useLocalization();
  const colorScheme = useColorScheme() ?? 'light';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const extractTags = (tagString: string): string[] => {
    const matches = tagString.match(/#\w+/g);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const onVoiceInput = async () => {
    setIsListening(true);
    try {
      // Note: Expo Speech is primarily for text-to-speech
      // For speech-to-text, we would need expo-speech-recognition or similar
      // For now, we'll simulate voice input
      setTimeout(() => {
        setContent(content + (content ? ' ' : '') + '[Voice input would go here]');
        setIsListening(false);
      }, 2000);
    } catch (error) {
      console.error('Voice input error:', error);
      setIsListening(false);
    }
  };

  const onSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Error', 'Please enter a title or content for your dream.');
      return;
    }

    setIsSaving(true);
    try {
      const dreamTags = extractTags(tags);
      await DreamStorage.saveDream({
        title: title.trim() || 'Untitled Dream',
        content: content.trim(),
        tags: dreamTags,
      });
      
      Alert.alert('Success', t('dreamSaved'));
      setTitle('');
      setContent('');
      setTags('');
    } catch (error) {
      console.error('Error saving dream:', error);
      Alert.alert('Error', 'Failed to save dream. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    ...styles.input,
    backgroundColor: colorScheme === 'dark' ? '#2C2F49' : '#FFFFFF',
    color: Colors[colorScheme].text,
    borderColor: colorScheme === 'dark' ? '#404566' : '#E0E0E0',
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
            style={inputStyle}
            value={title}
            onChangeText={setTitle}
            placeholder={t('titlePlaceholder')}
            placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            {t('content')}
          </ThemedText>
          <TextInput
            style={[inputStyle, styles.contentInput]}
            value={content}
            onChangeText={setContent}
            placeholder={t('dreamPlaceholder')}
            placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
            multiline
            textAlignVertical="top"
          />
          <GradientButton
            title={isListening ? t('listening') : t('voiceInput')}
            onPress={onVoiceInput}
            disabled={isListening}
            style={styles.voiceButton}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.label}>
            {t('tags')}
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={tags}
            onChangeText={setTags}
            placeholder={t('tagsPlaceholder')}
            placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
          />
        </View>

        <GradientButton
          title={isSaving ? 'Saving...' : t('save')}
          onPress={onSave}
          disabled={isSaving}
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
    padding: 16,
    gap: 20,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  section: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  voiceButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  saveButton: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
});
