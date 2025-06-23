import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientButton } from '@/components/GradientButton';
import { AIInterviewerService, InterviewSession, InterviewQuestion } from '@/services/AIInterviewerService';
import { Dream } from '@/types/Dream';
import { useLocalization } from '@/contexts/LocalizationContext';
import { THEME_CONSTANTS } from '@/constants/Theme';

interface AIInterviewerProps {
  dream: Dream;
  onComplete: (enhancedPrompt: string) => void;
  onCancel: () => void;
}

export function AIInterviewer({ dream, onComplete, onCancel }: AIInterviewerProps) {
  const { t } = useLocalization();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeInterview();
  }, []);

  const initializeInterview = async () => {
    try {
      setIsLoading(true);
      const newSession = await AIInterviewerService.startInterview(dream);
      
      if (!newSession) {
        Alert.alert(t('error'), 'Failed to start interview');
        onCancel();
        return;
      }

      setSession(newSession);
      const firstQuestion = AIInterviewerService.getNextQuestion(newSession);
      setCurrentQuestion(firstQuestion);
    } catch (error) {
      console.error('Error starting interview:', error);
      Alert.alert(t('error'), error instanceof Error ? error.message : 'Failed to start interview');
      onCancel();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!session || !currentQuestion || currentAnswer.trim().length === 0) {
      return;
    }

    // Add response to session
    const updatedSession = AIInterviewerService.addResponse(
      session,
      currentQuestion.id,
      currentAnswer.trim()
    );
    
    setSession(updatedSession);
    setCurrentAnswer('');

    // Check if interview is complete
    if (AIInterviewerService.isInterviewComplete(updatedSession)) {
      // Interview is complete
      if (updatedSession.enhancedPrompt) {
        onComplete(updatedSession.enhancedPrompt);
      } else {
        Alert.alert(t('error'), 'Failed to generate enhanced prompt');
        onCancel();
      }
      return;
    }

    // Get next question
    const nextQuestion = AIInterviewerService.getNextQuestion(updatedSession);
    setCurrentQuestion(nextQuestion);
  };

  const handleSkip = () => {
    if (!session || !currentQuestion) {
      return;
    }

    // Add empty response
    const updatedSession = AIInterviewerService.addResponse(
      session,
      currentQuestion.id,
      ''
    );
    
    setSession(updatedSession);
    setCurrentAnswer('');

    // Check if interview is complete
    if (AIInterviewerService.isInterviewComplete(updatedSession)) {
      if (updatedSession.enhancedPrompt) {
        onComplete(updatedSession.enhancedPrompt);
      } else {
        Alert.alert(t('error'), 'Failed to generate enhanced prompt');
        onCancel();
      }
      return;
    }

    // Get next question
    const nextQuestion = AIInterviewerService.getNextQuestion(updatedSession);
    setCurrentQuestion(nextQuestion);
  };

  const getProgress = (): number => {
    if (!session) return 0;
    return AIInterviewerService.getInterviewProgress(session);
  };

  const getQuestionNumber = (): number => {
    if (!session) return 0;
    return session.responses.length + 1;
  };

  const getTotalQuestions = (): number => {
    if (!session) return 0;
    return session.questions.length;
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Starting AI Interview...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!session || !currentQuestion) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText>Interview session not available</ThemedText>
          <GradientButton title={t('ok')} onPress={onCancel} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            AI Dream Interview
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Let's explore your dream in detail for a more accurate image
          </ThemedText>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            Question {getQuestionNumber()} of {getTotalQuestions()}
          </ThemedText>
        </View>

        {/* Dream Summary */}
        <View style={styles.dreamSummary}>
          <ThemedText style={styles.dreamTitle}>{dream.title}</ThemedText>
          <ThemedText style={styles.dreamContent} numberOfLines={3}>
            {dream.content}
          </ThemedText>
        </View>

        {/* Current Question */}
        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionLabel}>Question:</ThemedText>
          <ThemedText style={styles.questionText}>
            {currentQuestion.text.replace("'", "&apos;")}
          </ThemedText>
        </View>

        {/* Answer Input */}
        <View style={styles.answerContainer}>
          <TextInput
            style={styles.answerInput}
            placeholder="Describe in as much detail as you can remember..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <View style={styles.buttonRow}>
            <View style={styles.secondaryButton}>
              <GradientButton
                title="Skip"
                onPress={handleSkip}
                style={styles.skipButton}
              />
            </View>
            <View style={styles.primaryButton}>
              <GradientButton
                title="Next"
                onPress={handleSubmitAnswer}
                disabled={currentAnswer.trim().length === 0}
              />
            </View>
          </View>
          
          <GradientButton
            title="Cancel Interview"
            onPress={onCancel}
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: THEME_CONSTANTS.SPACING.LG,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: THEME_CONSTANTS.SPACING.LG,
  },
  header: {
    marginBottom: THEME_CONSTANTS.SPACING.XL,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: THEME_CONSTANTS.SPACING.SM,
  },
  subtitle: {
    textAlign: 'center',
    opacity: THEME_CONSTANTS.OPACITY.SUBTITLE,
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: THEME_CONSTANTS.SPACING.XL,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: THEME_CONSTANTS.SPACING.SM,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: THEME_CONSTANTS.OPACITY.SUBTITLE,
  },
  dreamSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: THEME_CONSTANTS.SPACING.MD,
    borderRadius: THEME_CONSTANTS.BORDER_RADIUS.MEDIUM,
    marginBottom: THEME_CONSTANTS.SPACING.XL,
  },
  dreamTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: THEME_CONSTANTS.SPACING.SM,
  },
  dreamContent: {
    fontSize: 14,
    opacity: THEME_CONSTANTS.OPACITY.SUBTITLE,
  },
  questionContainer: {
    marginBottom: THEME_CONSTANTS.SPACING.LG,
  },
  questionLabel: {
    fontSize: 12,
    opacity: THEME_CONSTANTS.OPACITY.SUBTITLE,
    marginBottom: THEME_CONSTANTS.SPACING.SM,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500',
  },
  answerContainer: {
    marginBottom: THEME_CONSTANTS.SPACING.XL,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: THEME_CONSTANTS.BORDER_RADIUS.MEDIUM,
    padding: THEME_CONSTANTS.SPACING.MD,
    color: 'white',
    fontSize: 16,
    minHeight: 120,
  },
  actionContainer: {
    gap: THEME_CONSTANTS.SPACING.LG,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: THEME_CONSTANTS.SPACING.MD,
  },
  secondaryButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
});