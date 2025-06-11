export const translations = {
  en: {
    recordDream: 'Record Dream',
    save: 'Save',
    dreamPlaceholder: 'Describe your dream...',
    diary: 'Diary',
    add: 'Add',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System'
  },
  ja: {
    recordDream: '夢を記録',
    save: '保存',
    dreamPlaceholder: '夢の内容を入力...',
    diary: '日記',
    add: '追加',
    settings: '設定',
    language: '言語',
    theme: 'テーマ',
    light: 'ライト',
    dark: 'ダーク',
    system: 'システム'
  },
};

export type TranslationKey = keyof typeof translations.en;
export type SupportedLanguage = keyof typeof translations;
