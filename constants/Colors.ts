/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#9b59b6';
const tintColorDark = '#9b59b6';

export const Colors = {
  light: {
    text: '#2E2E3A',
    background: '#F5F5FA',
    tint: tintColorLight,
    buttonStart: '#A8E6CF',
    buttonEnd: '#C8A2C8',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E0E0E0',
    background: '#1a1f36',
    tint: tintColorDark,
    buttonStart: '#2C2F49',
    buttonEnd: '#C8A2C8',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
