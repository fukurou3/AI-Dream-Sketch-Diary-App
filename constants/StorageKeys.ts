export const STORAGE_KEYS = {
  DREAMS: 'dreams',
  USER_PREFERENCES: 'user_preferences',
  GENERATION_CREDITS: 'generation_credits',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];