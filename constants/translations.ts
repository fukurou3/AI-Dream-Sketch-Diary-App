export const translations = {
  en: {
    recordDream: 'Record Dream',
    save: 'Save',
    dreamPlaceholder: 'Describe your dream...'
  },
  ja: {
    recordDream: '夢を記録',
    save: '保存',
    dreamPlaceholder: '夢の内容を入力...'
  },
};

export type TranslationKey = keyof typeof translations.en;
export type SupportedLanguage = keyof typeof translations;
