import { Dream } from '@/types/Dream';
import { SubscriptionService } from '@/services/SubscriptionService';

export interface InterviewQuestion {
  id: string;
  text: string;
  category: 'setting' | 'characters' | 'emotions' | 'details' | 'colors' | 'actions';
}

export interface InterviewResponse {
  questionId: string;
  question: string;
  answer: string;
  timestamp: Date;
}

export interface InterviewSession {
  id: string;
  dreamId: string;
  startedAt: Date;
  completedAt?: Date;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  enhancedPrompt?: string;
}

export class AIInterviewerService {
  // Pre-defined interview questions categorized by type
  private static readonly INTERVIEW_QUESTIONS: Record<string, InterviewQuestion[]> = {
    setting: [
      { id: 'setting_location', text: 'Where exactly did this dream take place? Can you describe the environment in detail?', category: 'setting' },
      { id: 'setting_time', text: 'What time of day was it in your dream? How did the lighting look?', category: 'setting' },
      { id: 'setting_weather', text: 'What was the weather like? Were there any specific atmospheric conditions?', category: 'setting' },
      { id: 'setting_architecture', text: 'If there were buildings or structures, what did they look like? Any specific architectural style?', category: 'setting' },
    ],
    characters: [
      { id: 'char_people', text: 'Who else was in your dream? Can you describe their appearance?', category: 'characters' },
      { id: 'char_animals', text: 'Were there any animals in your dream? What did they look like?', category: 'characters' },
      { id: 'char_interactions', text: 'How did you interact with the other people or beings in your dream?', category: 'characters' },
      { id: 'char_clothing', text: 'What were you and others wearing in the dream?', category: 'characters' },
    ],
    emotions: [
      { id: 'emotion_feeling', text: 'How did you feel during the dream? What emotions were strongest?', category: 'emotions' },
      { id: 'emotion_atmosphere', text: 'What was the overall mood or atmosphere of the dream?', category: 'emotions' },
      { id: 'emotion_fear', text: 'Were there any moments of fear, excitement, or surprise? What caused them?', category: 'emotions' },
    ],
    details: [
      { id: 'detail_sounds', text: 'Do you remember any specific sounds or music from your dream?', category: 'details' },
      { id: 'detail_objects', text: 'Were there any important objects or items in your dream? What did they look like?', category: 'details' },
      { id: 'detail_textures', text: 'Do you remember touching anything? What did surfaces feel like?', category: 'details' },
      { id: 'detail_scale', text: 'Were things normal-sized, or was anything unusually large or small?', category: 'details' },
    ],
    colors: [
      { id: 'color_dominant', text: 'What colors stood out most in your dream? Were there any dominant color schemes?', category: 'colors' },
      { id: 'color_unusual', text: 'Were there any unusual or impossible colors that don\'t exist in real life?', category: 'colors' },
      { id: 'color_light', text: 'How would you describe the quality of light? Was it bright, dim, colorful, or monochrome?', category: 'colors' },
    ],
    actions: [
      { id: 'action_movement', text: 'How were you moving in the dream? Walking, flying, floating, or something else?', category: 'actions' },
      { id: 'action_sequence', text: 'What was the sequence of main events? What happened first, then next?', category: 'actions' },
      { id: 'action_abilities', text: 'Did you have any special abilities or powers in the dream?', category: 'actions' },
    ],
  };

  // Start a new interview session
  static async startInterview(dream: Dream): Promise<InterviewSession | null> {
    // Check if user has Pro subscription
    const isPro = await SubscriptionService.hasProFeatures();
    if (!isPro) {
      throw new Error('AI Interviewer is a Pro feature. Please upgrade to access this functionality.');
    }

    // Select relevant questions based on dream content
    const selectedQuestions = this.selectRelevantQuestions(dream);

    const session: InterviewSession = {
      id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dreamId: dream.id,
      startedAt: new Date(),
      questions: selectedQuestions,
      responses: [],
    };

    return session;
  }

  // Get the next question in the interview
  static getNextQuestion(session: InterviewSession): InterviewQuestion | null {
    const answeredQuestionIds = session.responses.map(r => r.questionId);
    const nextQuestion = session.questions.find(q => !answeredQuestionIds.includes(q.id));
    return nextQuestion || null;
  }

  // Submit an answer to a question
  static addResponse(session: InterviewSession, questionId: string, answer: string): InterviewSession {
    const question = session.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question not found in session');
    }

    const response: InterviewResponse = {
      questionId,
      question: question.text,
      answer: answer.trim(),
      timestamp: new Date(),
    };

    const updatedSession = {
      ...session,
      responses: [...session.responses, response],
    };

    // Check if interview is complete
    if (updatedSession.responses.length >= updatedSession.questions.length) {
      updatedSession.completedAt = new Date();
      updatedSession.enhancedPrompt = this.generateEnhancedPrompt(updatedSession);
    }

    return updatedSession;
  }

  // Check if interview is complete
  static isInterviewComplete(session: InterviewSession): boolean {
    return session.responses.length >= session.questions.length;
  }

  // Generate enhanced prompt from interview responses
  private static generateEnhancedPrompt(session: InterviewSession): string {
    const responses = session.responses;
    let enhancedPrompt = '';

    // Group responses by category
    const responsesByCategory: Record<string, InterviewResponse[]> = {};
    responses.forEach(response => {
      const question = session.questions.find(q => q.id === response.questionId);
      if (question) {
        if (!responsesByCategory[question.category]) {
          responsesByCategory[question.category] = [];
        }
        responsesByCategory[question.category].push(response);
      }
    });

    // Build enhanced prompt by category
    const categoryOrder = ['setting', 'characters', 'actions', 'details', 'colors', 'emotions'];
    
    categoryOrder.forEach(category => {
      const categoryResponses = responsesByCategory[category];
      if (categoryResponses && categoryResponses.length > 0) {
        const categoryText = categoryResponses
          .map(r => r.answer)
          .filter(answer => answer.length > 0)
          .join(', ');
        
        if (categoryText.length > 0) {
          enhancedPrompt += `${categoryText}. `;
        }
      }
    });

    // Add Pro-specific quality modifiers
    enhancedPrompt += 'Highly detailed, photorealistic, professional quality, accurate representation, perfect composition, cinematic lighting.';

    return enhancedPrompt.trim();
  }

  // Select relevant questions based on dream content
  private static selectRelevantQuestions(dream: Dream): InterviewQuestion[] {
    const dreamContent = dream.content.toLowerCase();
    const dreamTags = dream.tags.map(tag => tag.toLowerCase());
    const allQuestions = Object.values(this.INTERVIEW_QUESTIONS).flat();
    
    // Always include at least one question from each main category
    const guaranteedQuestions: InterviewQuestion[] = [
      this.INTERVIEW_QUESTIONS.setting[0], // Location
      this.INTERVIEW_QUESTIONS.emotions[0], // Feelings
      this.INTERVIEW_QUESTIONS.details[1], // Objects
      this.INTERVIEW_QUESTIONS.colors[0], // Colors
    ];

    // Add relevant questions based on content analysis
    const additionalQuestions: InterviewQuestion[] = [];

    // Check for people/characters
    if (dreamContent.includes('person') || dreamContent.includes('people') || 
        dreamContent.includes('friend') || dreamContent.includes('family')) {
      additionalQuestions.push(this.INTERVIEW_QUESTIONS.characters[0]);
    }

    // Check for animals
    if (dreamContent.includes('animal') || dreamContent.includes('dog') || 
        dreamContent.includes('cat') || dreamContent.includes('bird')) {
      additionalQuestions.push(this.INTERVIEW_QUESTIONS.characters[1]);
    }

    // Check for movement/flying
    if (dreamContent.includes('fly') || dreamContent.includes('flying') || 
        dreamContent.includes('float') || dreamContent.includes('run')) {
      additionalQuestions.push(this.INTERVIEW_QUESTIONS.actions[0]);
    }

    // Check for buildings/architecture
    if (dreamContent.includes('house') || dreamContent.includes('building') || 
        dreamContent.includes('room') || dreamContent.includes('street')) {
      additionalQuestions.push(this.INTERVIEW_QUESTIONS.setting[3]);
    }

    // Check for weather/time
    if (dreamContent.includes('night') || dreamContent.includes('day') || 
        dreamContent.includes('rain') || dreamContent.includes('sunny')) {
      additionalQuestions.push(this.INTERVIEW_QUESTIONS.setting[1]);
    }

    // Combine and deduplicate
    const allSelectedQuestions = [...guaranteedQuestions, ...additionalQuestions];
    const uniqueQuestions = allSelectedQuestions.filter((question, index, self) => 
      index === self.findIndex(q => q.id === question.id)
    );

    // Limit to 6-8 questions to keep interview manageable
    return uniqueQuestions.slice(0, 8);
  }

  // Get interview progress
  static getInterviewProgress(session: InterviewSession): number {
    return (session.responses.length / session.questions.length) * 100;
  }
}