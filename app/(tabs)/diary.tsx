import React, { useState } from 'react';
import { FlatList, StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalization } from '@/contexts/LocalizationContext';

interface Entry {
  id: string;
  text: string;
}

export default function DiaryScreen() {
  const { t } = useLocalization();
  const [entries] = useState<Entry[]>([
    { id: '1', text: 'I was flying over a city filled with lights.' },
    { id: '2', text: 'A gentle river flowed backwards in time.' },
  ]);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <ThemedText style={styles.text}>{item.text}</ThemedText>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
  },
  separator: {
    height: 12,
  },
});
