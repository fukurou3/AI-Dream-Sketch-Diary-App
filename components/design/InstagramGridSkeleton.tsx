import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ShimmerPlaceholder } from './ShimmerPlaceholder';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const PADDING = DESIGN_SYSTEM.SPACING.LG;
const ITEM_SPACING = DESIGN_SYSTEM.SPACING.XS;
const ITEM_SIZE = (width - PADDING * 2 - ITEM_SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export const InstagramGridSkeleton = () => {
  const skeletonItems = Array.from({ length: 9 }); // Show 9 placeholders

  return (
    <View style={styles.container}>
      {skeletonItems.map((_, index) => (
        <ShimmerPlaceholder 
          key={index}
          width={ITEM_SIZE}
          height={ITEM_SIZE}
          borderRadius={DESIGN_SYSTEM.RADIUS.MD}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ITEM_SPACING,
    padding: PADDING,
  },
});
