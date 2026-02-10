/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';


export const SharedColors = {
  black: '#000000',
  white: '#FFFFFF',
  gray: '#687076',
  lightGray: '#E6E8E9',
  darkGray: '#4F5559',
  gray100: '#F5F5F5',
  gray200: '#878E94',
  gray300: '#71787E',
  gray400: '#575E63',
  gray500: '#687076',
  gray600: '#4F5559',
  gray700: '#373D41',
  gray800: '#1F2428',
  gray900: '#11181C',
  gray1000: '#000000',
  gray50: '#F9FAFB',
  red500: '#FF0000',
  orange500: '#FF6B35',
  orange600: '#E55A2B',

  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate1000: '#020617',
}


export const Colors = {
  light: {
    ...SharedColors,
    text: '#11181C',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    background: '#fff',
    foreground: '#000000',





    primary: '#009e81',
    primaryForeground: '#FFFFFF',
    secondary: '#4F5559',
    secondaryForeground: '#FFFFFF',
    cardBackground: '#FFFFFF',
    cardForeground: '#000000',
    border: '#E5E5E5',
    muted: '#687076',
    mutedForeground: '#FFFFFF',
    destructive: '#FF0000',
    destructiveForeground: '#FFFFFF',

  },
  dark: {
    ...SharedColors,
    text: '#ECEDEE',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    background: '#151718',
    foreground: '#000000',



    primary: '#009e81',
    primaryForeground: '#FFFFFF',
    secondary: '#4F5559',
    secondaryForeground: '#FFFFFF',
    cardBackground: '#FFFFFF',
    cardForeground: '#000000',
    border: '#E5E5E5',
    muted: '#687076',
    mutedForeground: '#FFFFFF',
    destructive: '#FF0000',
    destructiveForeground: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});



export type TSharedColors = typeof SharedColors;

export type TSharedColor = keyof TSharedColors;

export type TColors = typeof Colors['light']

export type TColor = keyof TColors;