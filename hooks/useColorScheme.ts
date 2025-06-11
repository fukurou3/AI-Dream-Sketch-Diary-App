import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeMode } from '@/contexts/ThemeContext';

export function useColorScheme() {
  const system = useSystemColorScheme();
  const { colorScheme } = useThemeMode();
  return colorScheme ?? system ?? 'light';
}
