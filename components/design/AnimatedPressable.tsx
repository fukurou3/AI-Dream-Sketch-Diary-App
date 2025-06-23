import React, { useRef } from 'react';
import { Pressable, Animated, PressableProps } from 'react-native';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  scaleValue?: number;
  duration?: number;
}

export function AnimatedPressable({ 
  children, 
  onPressIn, 
  onPressOut, 
  scaleValue = 0.95,
  duration = DESIGN_SYSTEM.ANIMATIONS.DURATION.FAST,
  ...props 
}: AnimatedPressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: any) => {
    Animated.timing(scaleAnim, {
      toValue: scaleValue,
      duration,
      useNativeDriver: true,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
    onPressOut?.(event);
  };

  return (
    <Pressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}