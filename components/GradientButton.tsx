import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function GradientButton({ title, onPress, style, disabled = false }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const start = Colors[colorScheme].buttonStart;
  const end = Colors[colorScheme].buttonEnd;

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  const buttonStyle = {
    ...styles.button,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Pressable onPress={handlePress} style={style} accessibilityRole="button" disabled={disabled}>
      <LinearGradient colors={[start, end]} style={buttonStyle}>
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
