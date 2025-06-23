import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from './AnimatedPressable';
import { DESIGN_SYSTEM, getThemeColors } from '@/constants/DesignSystem';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'SM' | 'MD' | 'LG' | 'XL';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function ModernButton({
  title,
  onPress,
  variant = 'primary',
  size = 'MD',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: ModernButtonProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  const sizeConfig = DESIGN_SYSTEM.SIZES.BUTTON[size];

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...sizeConfig,
      borderRadius: DESIGN_SYSTEM.RADIUS.XL,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: DESIGN_SYSTEM.COLORS.PRIMARY,
          ...DESIGN_SYSTEM.SHADOWS.SM,
        };
      
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: DESIGN_SYSTEM.COLORS.SECONDARY,
          ...DESIGN_SYSTEM.SHADOWS.SM,
        };
      
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: DESIGN_SYSTEM.COLORS.PRIMARY,
        };
      
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      
      case 'gradient':
        return baseStyle;
      
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontSize: size === 'SM' ? DESIGN_SYSTEM.TYPOGRAPHY.SIZES.SM : 
                size === 'LG' ? DESIGN_SYSTEM.TYPOGRAPHY.SIZES.LG :
                size === 'XL' ? DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XL :
                DESIGN_SYSTEM.TYPOGRAPHY.SIZES.MD,
      fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.SEMIBOLD,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'gradient':
        return {
          ...baseTextStyle,
          color: DESIGN_SYSTEM.COLORS.WHITE,
        };
      
      case 'outline':
        return {
          ...baseTextStyle,
          color: DESIGN_SYSTEM.COLORS.PRIMARY,
        };
      
      case 'ghost':
        return {
          ...baseTextStyle,
          color: themeColors.TEXT_PRIMARY,
        };
      
      default:
        return baseTextStyle;
    }
  };

  const ButtonContent = () => (
    <>
      {leftIcon && <>{leftIcon}</>}
      <Text style={[
        getTextStyle(), 
        textStyle, 
        leftIcon ? { marginLeft: 8 } : undefined, 
        rightIcon ? { marginRight: 8 } : undefined
      ]}>
        {loading ? 'Loading...' : title}
      </Text>
      {rightIcon && <>{rightIcon}</>}
    </>
  );

  if (variant === 'gradient') {
    return (
      <AnimatedPressable onPress={onPress} disabled={disabled || loading} style={style}>
        <LinearGradient
          colors={DESIGN_SYSTEM.COLORS.GRADIENT.PRIMARY}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[getButtonStyle(), DESIGN_SYSTEM.SHADOWS.SM]}
        >
          <ButtonContent />
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable 
      onPress={onPress} 
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
    >
      <ButtonContent />
    </AnimatedPressable>
  );
}