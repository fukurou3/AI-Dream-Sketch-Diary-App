import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ModernCard } from '@/components/design/ModernCard';
import { ShimmerPlaceholder } from '@/components/design/ShimmerPlaceholder';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';

export const DreamItemSkeleton = () => {
  return (
    <ModernCard variant="elevated" style={styles.dreamItem}>
      <View style={styles.dreamHeader}>
        <ShimmerPlaceholder width={180} height={24} borderRadius={DESIGN_SYSTEM.RADIUS.SM} />
        <ShimmerPlaceholder width={80} height={16} borderRadius={DESIGN_SYSTEM.RADIUS.SM} />
      </View>
      
      <View style={styles.contentContainer}>
        <ShimmerPlaceholder width={280} height={18} borderRadius={DESIGN_SYSTEM.RADIUS.SM} />
        <ShimmerPlaceholder width={250} height={18} borderRadius={DESIGN_SYSTEM.RADIUS.SM} />
        <ShimmerPlaceholder width={200} height={18} borderRadius={DESIGN_SYSTEM.RADIUS.SM} />
      </View>
      
      <View style={styles.tagsContainer}>
        <ShimmerPlaceholder width={70} height={28} borderRadius={DESIGN_SYSTEM.RADIUS.ROUND} />
        <ShimmerPlaceholder width={90} height={28} borderRadius={DESIGN_SYSTEM.RADIUS.ROUND} />
      </View>
      
      <View style={styles.buttonContainer}>
        <ShimmerPlaceholder width={140} height={48} borderRadius={DESIGN_SYSTEM.RADIUS.MD} />
        <ShimmerPlaceholder width={140} height={48} borderRadius={DESIGN_SYSTEM.RADIUS.MD} />
      </View>
    </ModernCard>
  );
};

const styles = StyleSheet.create({
  dreamItem: {
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  contentContainer: {
    gap: DESIGN_SYSTEM.SPACING.SM,
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.SPACING.XS,
    marginBottom: DESIGN_SYSTEM.SPACING.LG,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: DESIGN_SYSTEM.SPACING.SM,
    justifyContent: 'space-between',
  },
});
