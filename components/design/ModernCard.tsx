import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DESIGN_SYSTEM, getThemeColors } from '@/constants/DesignSystem';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient' | 'glass';
  style?: ViewStyle;
  padding?: keyof typeof DESIGN_SYSTEM.SPACING;
  radius?: keyof typeof DESIGN_SYSTEM.RADIUS;
}

export function ModernCard({ 
  children, 
  variant = 'default', 
  style,
  padding = 'LG',
  radius = 'XL'
}: ModernCardProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  
  const baseStyle = {
    padding: DESIGN_SYSTEM.SPACING[padding],
    borderRadius: DESIGN_SYSTEM.RADIUS[radius],
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [
          baseStyle,
          {
            backgroundColor: themeColors.CARD,
            ...DESIGN_SYSTEM.SHADOWS.MD,
          },
          style
        ];
      
      case 'glass':
        return [
          baseStyle,
          {
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
          },
          style
        ];
      
      case 'gradient':
        return null; // Handled by LinearGradient
      
      default:
        return [
          baseStyle,
          {
            backgroundColor: themeColors.CARD,
            borderWidth: 1,
            borderColor: themeColors.BORDER,
          },
          style
        ];
    }
  };

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={DESIGN_SYSTEM.COLORS.GRADIENT.DREAM}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[baseStyle, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
}