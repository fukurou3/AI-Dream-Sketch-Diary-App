import React from 'react';
import { Text, TextStyle } from 'react-native';
import { DESIGN_SYSTEM, getThemeColors } from '@/constants/DesignSystem';
import { useColorScheme } from '@/hooks/useColorScheme';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'success';
  weight?: keyof typeof DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: TextStyle;
  numberOfLines?: number;
}

export function Typography({
  children,
  variant = 'body1',
  color = 'primary',
  weight,
  align = 'left',
  style,
  numberOfLines,
}: TypographyProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXXXXL,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXXXXL * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.TIGHT,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.BOLD,
        };
      case 'h2':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXXXL,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXXXL * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.TIGHT,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.BOLD,
        };
      case 'h3':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXXL,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXXL * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.TIGHT,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.SEMIBOLD,
        };
      case 'h4':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXL,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXL * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.NORMAL,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.SEMIBOLD,
        };
      case 'h5':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XL,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XL * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.NORMAL,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.MEDIUM,
        };
      case 'h6':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.LG,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.LG * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.NORMAL,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.MEDIUM,
        };
      case 'body1':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.MD,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.MD * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.RELAXED,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.REGULAR,
        };
      case 'body2':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.SM,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.SM * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.RELAXED,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.REGULAR,
        };
      case 'caption':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XS,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XS * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.NORMAL,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.REGULAR,
        };
      case 'overline':
        return {
          fontSize: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXS,
          lineHeight: DESIGN_SYSTEM.TYPOGRAPHY.SIZES.XXS * DESIGN_SYSTEM.TYPOGRAPHY.LINE_HEIGHTS.NORMAL,
          fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS.MEDIUM,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        };
      default:
        return {};
    }
  };

  const getColorStyle = (): { color: string } => {
    switch (color) {
      case 'primary':
        return { color: themeColors.TEXT_PRIMARY };
      case 'secondary':
        return { color: themeColors.TEXT_SECONDARY };
      case 'tertiary':
        return { color: themeColors.TEXT_TERTIARY };
      case 'accent':
        return { color: DESIGN_SYSTEM.COLORS.PRIMARY };
      case 'error':
        return { color: DESIGN_SYSTEM.COLORS.ERROR };
      case 'success':
        return { color: DESIGN_SYSTEM.COLORS.SUCCESS };
      default:
        return { color: themeColors.TEXT_PRIMARY };
    }
  };

  const finalStyle: TextStyle = {
    ...getVariantStyle(),
    ...getColorStyle(),
    textAlign: align,
    ...(weight && { fontWeight: DESIGN_SYSTEM.TYPOGRAPHY.WEIGHTS[weight] }),
    ...style,
  };

  return (
    <Text style={finalStyle} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}