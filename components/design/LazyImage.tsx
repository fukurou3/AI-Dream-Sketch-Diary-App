import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';
import { Typography } from './Typography';

interface LazyImageProps {
  source: { uri: string };
  style?: ViewStyle;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  placeholder?: string;
}

export function LazyImage({ 
  source, 
  style, 
  contentFit = 'cover',
  placeholder = '🖼️'
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        transition={200}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      
      {(isLoading || hasError) && (
        <View style={styles.placeholder}>
          <Typography variant="h4" align="center" color="secondary">
            {hasError ? '❌' : placeholder}
          </Typography>
          {hasError && (
            <Typography variant="caption" align="center" color="tertiary">
              Failed to load
            </Typography>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: DESIGN_SYSTEM.COLORS.GREY[200],
    borderRadius: DESIGN_SYSTEM.RADIUS.MD,
    overflow: 'hidden',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});