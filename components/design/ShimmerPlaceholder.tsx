import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';

interface ShimmerPlaceholderProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

const SHIMMER_COLORS = [
  DESIGN_SYSTEM.COLORS.SURFACE_2,
  DESIGN_SYSTEM.COLORS.SURFACE_3,
  DESIGN_SYSTEM.COLORS.SURFACE_2,
];

export const ShimmerPlaceholder = ({ 
  width, 
  height, 
  borderRadius = DESIGN_SYSTEM.RADIUS.MD, 
  style 
}: ShimmerPlaceholderProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1, // Infinite repeat
      false
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-width, width],
      Extrapolate.CLAMP
    );
    return { transform: [{ translateX }] };
  });

  return (
    <View style={[{ width, height, borderRadius, overflow: 'hidden', backgroundColor: DESIGN_SYSTEM.COLORS.SURFACE_2 }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={SHIMMER_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};
