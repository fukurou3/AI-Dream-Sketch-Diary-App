import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientButton } from '@/components/GradientButton';
import { ModernCard } from '@/components/design/ModernCard';
import { ModernButton } from '@/components/design/ModernButton';
import { Typography } from '@/components/design/Typography';
import { AnimatedPressable } from '@/components/design/AnimatedPressable';
import { TicketService } from '@/services/TicketService';
import { AdService } from '@/services/AdService';
import { UserTicketStatus } from '@/types/Ticket';
import { useLocalization } from '@/contexts/LocalizationContext';
import { DESIGN_SYSTEM } from '@/constants/DesignSystem';

interface TicketDisplayProps {
  onTicketUpdate?: () => void;
}

export function TicketDisplay({ onTicketUpdate }: TicketDisplayProps) {
  const { t } = useLocalization();
  const [ticketStatus, setTicketStatus] = useState<UserTicketStatus | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [timeUntilNextAd, setTimeUntilNextAd] = useState(0);

  useEffect(() => {
    loadTicketStatus();
    const interval = setInterval(loadTicketStatus, 1000); // Update every second for countdown
    return () => clearInterval(interval);
  }, []);

  const loadTicketStatus = async () => {
    try {
      const status = await TicketService.getUserTicketStatus();
      setTicketStatus(status);
      
      const timeUntilNext = TicketService.getTimeUntilNextAd(status.lastAdWatchedAt);
      setTimeUntilNextAd(timeUntilNext);
    } catch (error) {
      console.error('Error loading ticket status:', error);
    }
  };

  const handleWatchAd = async () => {
    if (!ticketStatus?.canWatchAd || isWatchingAd) {
      return;
    }

    setIsWatchingAd(true);
    
    try {
      // Show the ad
      const adCompleted = await AdService.showRewardedAd();
      
      if (adCompleted) {
        // Award ticket for watching ad
        const ticketAwarded = await TicketService.awardTicketForAd();
        
        if (ticketAwarded) {
          Alert.alert(
            t('congratulations'),
            t('ticketEarned'),
            [{ text: t('ok'), onPress: () => {} }]
          );
          
          // Reload ticket status and notify parent
          await loadTicketStatus();
          onTicketUpdate?.();
        } else {
          Alert.alert(t('error'), t('failedToEarnTicket'));
        }
      } else {
        Alert.alert(t('adNotCompleted'), t('adNotCompletedMessage'));
      }
    } catch (error) {
      console.error('Error watching ad:', error);
      Alert.alert(t('error'), t('adError'));
    } finally {
      setIsWatchingAd(false);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  if (!ticketStatus) {
    return null;
  }

  return (
    <ModernCard variant="glass" style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)']}
        style={styles.ticketGradient}
      >
        <View style={styles.ticketInfo}>
          <View style={styles.ticketCount}>
            <Typography variant="h1" style={styles.ticketNumber}>
              {ticketStatus.availableTickets}
            </Typography>
            <Typography variant="caption" color="secondary" style={styles.ticketLabel}>
              {t('availableTickets')}
            </Typography>
          </View>
          
          <View style={styles.stats}>
            <Typography variant="caption" color="tertiary" style={styles.statText}>
              {t('earned')}: {ticketStatus.totalTicketsEarned}
            </Typography>
            <Typography variant="caption" color="tertiary" style={styles.statText}>
              {t('used')}: {ticketStatus.totalTicketsUsed}
            </Typography>
            <Typography variant="caption" color="tertiary" style={styles.statText}>
              {t('purchased')}: {ticketStatus.totalTicketsPurchased}
            </Typography>
          </View>
        </View>

        <View style={styles.actions}>
          {ticketStatus.canWatchAd ? (
            <ModernButton
              title={isWatchingAd ? t('watchingAd') : `🎬 ${t('watchAdForTicket')}`}
              onPress={handleWatchAd}
              disabled={isWatchingAd}
              variant="gradient"
              size="LG"
            />
          ) : (
            <View style={styles.cooldownContainer}>
              <Typography variant="caption" color="secondary" align="center" style={styles.cooldownText}>
                {t('nextAdIn')}: {formatTime(timeUntilNextAd)}
              </Typography>
              <ModernButton
                title={t('watchAdForTicket')}
                onPress={() => {}}
                disabled={true}
                variant="outline"
                size="LG"
              />
            </View>
          )}
          
          <ModernButton
            title={`💎 ${t('buyTickets')}`}
            onPress={() => {}}
            variant="outline"
            size="MD"
            style={styles.purchaseButton}
          />
        </View>
      </LinearGradient>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: DESIGN_SYSTEM.SPACING.LG,
    marginBottom: DESIGN_SYSTEM.SPACING.MD,
  },
  ticketGradient: {
    borderRadius: DESIGN_SYSTEM.RADIUS.XL,
    padding: DESIGN_SYSTEM.SPACING.LG,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.SPACING.LG,
  },
  ticketCount: {
    alignItems: 'center',
  },
  ticketNumber: {
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ticketLabel: {
    textAlign: 'center',
    marginTop: DESIGN_SYSTEM.SPACING.XS,
  },
  stats: {
    alignItems: 'flex-end',
    gap: DESIGN_SYSTEM.SPACING.XS,
  },
  statText: {
    // Typography component handles styling
  },
  actions: {
    gap: DESIGN_SYSTEM.SPACING.MD,
  },
  cooldownContainer: {
    gap: DESIGN_SYSTEM.SPACING.SM,
  },
  cooldownText: {
    // Typography component handles styling
  },
  purchaseButton: {
    marginTop: DESIGN_SYSTEM.SPACING.XS,
  },
});