// https://m3.material.io/styles/typography/applying-type
// Display: largest text, expressive
// Headline: second-largest, express
// Title: medium-emphasis, less expressive, page titles, app bar, category header, secondary header
// Body: readable for long passages of text
// Labels: the smallest text, captions

import {configureFonts, MD3LightTheme} from 'react-native-paper';
import {Fonts, ThemeProp} from 'react-native-paper/lib/typescript/types';

const primaryFontFamily = 'Lato-Regular';

export const theme: ThemeProp = {
  ...MD3LightTheme,
  roundness: 4,
  version: 3,
  colors: {
    ...MD3LightTheme.colors,
    backdrop: '#2236', // modal overlay
    // background: '#F00',
    // elevation: '#FF0',
    error: '#F80F00',
    // errorContainer: '#F80F00',
    // inverseOnSurface: '#F00',
    // inversePrimary: '#F00',
    // inverseSurface: '#F00',
    surfaceDisabled: '#29434E',
    onSurfaceDisabled: 'gray',
    primary: '#EC407A',
    primaryContainer: '#EC407A',
    secondary: '#EDA3C6',
    secondaryContainer: '#EDA3C6',
    tertiary: '#546E7A',
    tertiaryContainer: '#546E7A',
    background: '#FFFFFF',
    outline: '#BE7896',
    // surface: '#ffddf1',
    // scrim: '#F00',
    // shadow: '#F000',
    dark: '#0E1011',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    default: {
      fontFamily: 'Lato-Regular',
      fontWeight: 'normal',
    },
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: primaryFontFamily,
    },
    displayMedium: {
      ...MD3LightTheme.fonts.displayMedium,
      fontFamily: primaryFontFamily,
    },
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontFamily: primaryFontFamily,
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: primaryFontFamily,
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: primaryFontFamily,
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: primaryFontFamily,
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: primaryFontFamily,
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: primaryFontFamily,
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: primaryFontFamily,
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: primaryFontFamily,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: primaryFontFamily,
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: primaryFontFamily,
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: primaryFontFamily,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: primaryFontFamily,
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: primaryFontFamily,
    },
  },
};

export default theme;
