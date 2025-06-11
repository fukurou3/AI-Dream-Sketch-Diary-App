import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorScheme: NonNullable<ColorSchemeName>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const systemScheme = Appearance.getColorScheme() ?? 'light';
  const colorScheme = mode === 'system' ? systemScheme : mode;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
