import React from 'react';
import { GradientButton } from '@/components/GradientButton';
import { useLocalization } from '@/contexts/LocalizationContext';

interface VoiceInputButtonProps {
  onVoiceInput: () => Promise<void>;
  isListening: boolean;
  style?: object;
}

export function VoiceInputButton({ 
  onVoiceInput, 
  isListening, 
  style 
}: VoiceInputButtonProps) {
  const { t } = useLocalization();

  return (
    <GradientButton
      title={isListening ? t('listening') : t('voiceInput')}
      onPress={onVoiceInput}
      disabled={isListening}
      style={style}
    />
  );
}