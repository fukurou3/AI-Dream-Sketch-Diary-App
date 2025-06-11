import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useThemeMode, ThemeMode } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { language, setLanguage, t } = useLocalization();
  const { mode, setMode } = useThemeMode();

  const ThemeOption = ({ value, label }: { value: ThemeMode; label: string }) => (
    <Pressable style={styles.row} onPress={() => setMode(value)}>
      <ThemedText style={styles.optionText}>
        {label} {mode === value ? '✓' : ''}
      </ThemedText>
    </Pressable>
  );

  const LangOption = ({ value, label }: { value: 'en' | 'ja'; label: string }) => (
    <Pressable style={styles.row} onPress={() => setLanguage(value)}>
      <ThemedText style={styles.optionText}>
        {label} {language === value ? '✓' : ''}
      </ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t('language')}
      </ThemedText>
      <View style={styles.section}>
        <LangOption value="en" label="English" />
        <LangOption value="ja" label="日本語" />
      </View>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t('theme')}
      </ThemedText>
      <View style={styles.section}>
        <ThemeOption value="system" label={t('system')} />
        <ThemeOption value="light" label={t('light')} />
        <ThemeOption value="dark" label={t('dark')} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
});
