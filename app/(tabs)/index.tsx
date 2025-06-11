import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const SAMPLE = [
  { id: '1', title: '不思議な森', content: '霧の中をさまよった…' },
  { id: '2', title: '空を飛ぶ夢', content: '雲の上を自由に飛んだ。' },
];

function Item({ title, content }: { title: string; content: string }) {
  return (
    <ThemedView style={styles.item}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText numberOfLines={2}>{content}</ThemedText>
    </ThemedView>
  );
}

export default function DiaryScreen() {
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={SAMPLE}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <Item title={item.title} content={item.content} />
        )}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
