import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function GradientButton({ title, onPress, style }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const start = Colors[colorScheme].buttonStart;
  const end = Colors[colorScheme].buttonEnd;

  return (
    <Pressable onPress={onPress} style={style} accessibilityRole="button">
      <LinearGradient colors={[start, end]} style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
