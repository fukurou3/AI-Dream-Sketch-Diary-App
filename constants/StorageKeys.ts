export const STORAGE_KEYS = {
  DREAMS: 'dreams',
  USER_PREFERENCES: 'user_preferences',
  GENERATION_CREDITS: 'generation_credits',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
  TICKETS: 'tickets',
  LAST_AD_WATCHED: 'last_ad_watched',
  USER_SUBSCRIPTION: 'user_subscription',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];