import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { GradientButton } from '@/components/GradientButton';
import { useLocalization } from '@/contexts/LocalizationContext';

export default function RecordScreen() {
  const { t, language, setLanguage } = useLocalization();
  const [dream, setDream] = useState('');

  const onSave = () => {
    Alert.alert(t('save'), dream || t('dreamPlaceholder'));
    setDream('');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <GradientButton
          title={language === 'en' ? '日本語' : 'English'}
          onPress={() => setLanguage(language === 'en' ? 'ja' : 'en')}
        />
      </View>
      <TextInput
        style={styles.input}
        value={dream}
        onChangeText={setDream}
        placeholder={t('dreamPlaceholder')}
        multiline
      />
      <GradientButton title={t('save')} onPress={onSave} style={styles.button} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    alignSelf: 'flex-end',
  },
});
