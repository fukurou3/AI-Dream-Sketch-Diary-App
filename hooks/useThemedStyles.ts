import { useMemo } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { THEME_CONSTANTS } from '@/constants/Theme';

export const useThemedInputStyle = () => {
  const colorScheme = useColorScheme() ?? 'light';
  
  return useMemo(() => ({
    backgroundColor: colorScheme === 'dark' 
      ? THEME_CONSTANTS.DARK_COLORS.INPUT_BACKGROUND 
      : THEME_CONSTANTS.LIGHT_COLORS.INPUT_BACKGROUND,
    color: Colors[colorScheme].text,
    borderColor: colorScheme === 'dark' 
      ? THEME_CONSTANTS.DARK_COLORS.BORDER 
      : THEME_CONSTANTS.LIGHT_COLORS.BORDER,
  }), [colorScheme]);
};

export const useThemedCardStyle = () => {
  const colorScheme = useColorScheme() ?? 'light';
  
  return useMemo(() => ({
    backgroundColor: colorScheme === 'dark' 
      ? THEME_CONSTANTS.DARK_COLORS.CARD_BACKGROUND 
      : THEME_CONSTANTS.LIGHT_COLORS.CARD_BACKGROUND,
    borderColor: colorScheme === 'dark' 
      ? THEME_CONSTANTS.DARK_COLORS.BORDER 
      : THEME_CONSTANTS.LIGHT_COLORS.BORDER,
  }), [colorScheme]);
};

export const useThemedPlaceholderColor = () => {
  const colorScheme = useColorScheme() ?? 'light';
  
  return useMemo(() => 
    colorScheme === 'dark' 
      ? THEME_CONSTANTS.PLACEHOLDERS.DARK 
      : THEME_CONSTANTS.PLACEHOLDERS.LIGHT,
    [colorScheme]
  );
};