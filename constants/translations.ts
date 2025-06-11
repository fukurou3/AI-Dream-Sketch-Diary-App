export const translations = {
  en: {
    recordDream: 'Record Dream',
    save: 'Save',
    dreamPlaceholder: 'Describe your dream...',
    diary: 'Diary',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    addEntry: 'Add Entry'
  },
  ja: {
    recordDream: '夢を記録',
    save: '保存',
    dreamPlaceholder: '夢の内容を入力...',
    diary: '日記',
    settings: '設定',
    language: '言語',
    theme: 'テーマ',
    system: 'システムに従う',
    light: 'ライト',
    dark: 'ダーク',
    addEntry: '追加'
  },
};

export type TranslationKey = keyof typeof translations.en;
export type SupportedLanguage = keyof typeof translations;
