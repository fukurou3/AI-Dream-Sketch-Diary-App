import React from 'react';
import { Modal, View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ModernCard } from './ModernCard';
import { Typography } from './Typography';
import { ModernButton } from './ModernButton';
import { AnimatedPressable } from './AnimatedPressable';
import { SubscriptionService } from '@/services/SubscriptionService';
import { SubscriptionPlan } from '@/types/Subscription';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';
import { useLocalization } from '@/contexts/LocalizationContext';

interface ProUpsellModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
  dreamImage?: string; // Optional image from the free generation
}

const ProFeature = ({ feature }: { feature: string }) => (
  <View style={styles.featureItem}>
    <Typography variant="body1" color="primary">✨</Typography>
    <Typography variant="body1" color="secondary" style={styles.featureText}>
      {feature}
    </Typography>
  </View>
);

export const ProUpsellModal = ({ visible, onClose, onSubscribe, dreamImage }: ProUpsellModalProps) => {
  const { t } = useLocalization();
  const plans = SubscriptionService.getSubscriptionPlans();

  const handleSubscribe = (planId: string) => {
    onSubscribe(planId);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={styles.modalOverlay}
      >
        <ModernCard variant="glass" style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <AnimatedPressable style={styles.closeButton} onPress={onClose}>
              <Typography variant="h4" color="primary">×</Typography>
            </AnimatedPressable>

            <Typography variant="h2" weight="BOLD" align="center" style={styles.title}>
              💎 Pro版にアップグレード
            </Typography>
            <Typography variant="body1" color="secondary" align="center" style={styles.subtitle}>
              あなたの夢を、もっと忠実に、もっと美しく。
            </Typography>

            <View style={styles.imageComparison}>
              <View style={styles.imageContainer}>
                <Typography variant="caption" align="center" color="tertiary">無料版の画像</Typography>
                {dreamImage ? (
                  <Image source={{ uri: dreamImage }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.placeholderImage]}>
                    <Typography variant="h1">🎨</Typography>
                  </View>
                )}
              </View>
              <View style={styles.imageContainer}>
                <Typography variant="caption" align="center" color="tertiary">Pro版 (高品質)</Typography>
                {/* Placeholder for Pro image - ideally show a much better version */}
                <Image source={{ uri: 'https://via.placeholder.com/150/FFD700/000000?text=Pro' }} style={styles.image} />
              </View>
            </View>

            <View style={styles.featuresSection}>
              {plans[0]?.features.map((feature, index) => (
                <ProFeature key={index} feature={feature} />
              ))}
            </View>

            <View style={styles.plansSection}>
              {plans.map((plan) => (
                <AnimatedPressable key={plan.id} onPress={() => handleSubscribe(plan.id)}>
                  <ModernCard variant="outline" style={styles.planCard}>
                    <Typography variant="h5" weight="MEDIUM">{plan.name}</Typography>
                    <Typography variant="body1" color="secondary">
                      {plan.price} {plan.currency} / {plan.billingPeriod === 'monthly' ? '月' : '年'}
                    </Typography>
                    {plan.isPopular && (
                      <View style={styles.popularBadge}>
                        <Typography variant="caption" color="primary">一番人気</Typography>
                      </View>
                    )}
                  </ModernCard>
                </AnimatedPressable>
              ))}
            </View>

            <ModernButton
              title="今はしない"
              onPress={onClose}
              variant="text"
              size="SM"
              style={styles.noThanksButton}
            />
          </ScrollView>
        </ModernCard>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: DESIGN_SYSTEM.RADIUS.XXL,
    padding: DESIGN_SYSTEM.SPACING.LG,
  },
  scrollContainer: {
    paddingBottom: DESIGN_SYSTEM.SPACING.LG,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: DESIGN_SYSTEM.SPACING.SM,
    zIndex: 1,
  },
  title: {
    marginBottom: DESIGN_SYSTEM.SPACING.SM,
  },
  subtitle: {
    marginBottom: DESIGN_SYSTEM.SPACING.LG,
  },
  imageComparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: DESIGN_SYSTEM.SPACING.LG,
  },
  imageContainer: {
    alignItems: 'center',
    gap: DESIGN_SYSTEM.SPACING.XS,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: DESIGN_SYSTEM.RADIUS.MD,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  placeholderImage: {
    backgroundColor: DESIGN_SYSTEM.COLORS.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresSection: {
    marginBottom: DESIGN_SYSTEM.SPACING.XL,
    gap: DESIGN_SYSTEM.SPACING.SM,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_SYSTEM.SPACING.MD,
  },
  featureText: {
    flex: 1,
  },
  plansSection: {
    gap: DESIGN_SYSTEM.SPACING.MD,
  },
  planCard: {
    padding: DESIGN_SYSTEM.SPACING.LG,
    alignItems: 'center',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: DESIGN_SYSTEM.COLORS.ACCENT,
    paddingHorizontal: DESIGN_SYSTEM.SPACING.SM,
    paddingVertical: DESIGN_SYSTEM.SPACING.XS,
    borderRadius: DESIGN_SYSTEM.RADIUS.LG,
    transform: [{ rotate: '10deg' }],
  },
  noThanksButton: {
    marginTop: DESIGN_SYSTEM.SPACING.MD,
  },
});
