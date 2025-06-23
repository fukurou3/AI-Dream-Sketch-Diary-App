# AI Dream Sketch Diary App - Claude Development Notes

## プロジェクト概要
「AI×夢スケッチ日記帳」アプリの開発 - 夢の記録とAI画像生成機能を持つReact Native/Expoアプリ

## 開発環境・技術スタック
- React Native with Expo
- TypeScript
- Context API (Theme, Localization)
- React Navigation
- Expo-ImageGenerator / AI Services
- Storage: AsyncStorage

## 現在のアプリ構成
```
app/
├── (tabs)/
│   ├── _layout.tsx - タブナビゲーション
│   ├── index.tsx - ホーム画面
│   ├── record.tsx - 夢記録画面
│   └── settings.tsx - 設定画面
├── _layout.tsx - ルートレイアウト
components/
├── DreamItem.tsx - 夢アイテム表示
├── GradientButton.tsx - グラデーションボタン
├── VoiceInputButton.tsx - 音声入力ボタン
└── ui/IconSymbol.tsx - アイコンシンボル
contexts/
├── LocalizationContext.tsx - 多言語対応
└── ThemeContext.tsx - テーマ管理
services/
├── AIImageGenerator.ts - AI画像生成
├── DreamStorage.ts - 夢データ保存
└── SharingService.ts - SNS共有
types/Dream.ts - 夢データ型定義
```

## 企画書に基づく主要機能
1. 夢の記録機能（テキスト・音声入力）
2. AI画像生成機能（無料版・Pro版）
3. ギャラリー機能（カレンダー・画像アルバム）
4. SNS共有機能
5. チケット制度（景品表示法対応）

## 開発コマンド
- 開発サーバー起動: `npm start` または `npx expo start`
- TypeScript型チェック: `npx tsc --noEmit`
- Linting: `npx eslint .`
- ビルド: `npx expo build`

## 重要な実装ポイント
- 無料版: 広告視聴→チケット付与→画像生成（低コストAPI使用）
- Pro版: 高品質画像生成、AIインタビュアー機能
- 景品表示法対応のチケット制度
- インスタグラム風グリッドレイアウトのマイページ