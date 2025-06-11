import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useThemePreference } from '@/contexts/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

function Option({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) {
  const scheme = useColorScheme() ?? 'light';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        selected && { backgroundColor: Colors[scheme].buttonStart },
      ]}
    >
      <ThemedText>{label}</ThemedText>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { t, language, setLanguage } = useLocalization();
  const { preference, setPreference } = useThemePreference();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t('settings')}</ThemedText>
      <ThemedText type="subtitle">{t('language')}</ThemedText>
      <View style={styles.row}>
        <Option label="English" onPress={() => setLanguage('en')} selected={language === 'en'} />
        <Option label="日本語" onPress={() => setLanguage('ja')} selected={language === 'ja'} />
      </View>
      <ThemedText type="subtitle">{t('theme')}</ThemedText>
      <View style={styles.row}>
        <Option label={t('light')} onPress={() => setPreference('light')} selected={preference === 'light'} />
        <Option label={t('dark')} onPress={() => setPreference('dark')} selected={preference === 'dark'} />
        <Option label={t('system')} onPress={() => setPreference('system')} selected={preference === 'system'} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
