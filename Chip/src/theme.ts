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
  // ...MD3LightTheme,
  roundness: 4,
  version: 3,
  colors: {
    primary: 'rgb(184, 15, 85)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(255, 217, 223)',
    onPrimaryContainer: 'rgb(63, 0, 24)',
    secondary: 'rgb(255, 216, 232)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(255, 176, 208)',
    onSecondaryContainer: 'rgb(61, 0, 39)',
    tertiary: 'rgb(0, 103, 130)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(187, 233, 255)',
    onTertiaryContainer: 'rgb(0, 31, 41)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 255)',
    onBackground: 'rgb(32, 26, 27)',
    surface: 'rgb(255, 251, 255)',
    onSurface: 'rgb(32, 26, 27)',
    surfaceVariant: 'rgb(243, 221, 224)',
    onSurfaceVariant: 'rgb(82, 67, 70)',
    outline: 'rgb(132, 115, 117)',
    outlineVariant: 'rgb(214, 194, 196)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(53, 47, 48)',
    inverseOnSurface: 'rgb(250, 238, 239)',
    inversePrimary: 'rgb(255, 177, 194)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(251, 239, 247)',
      level2: 'rgb(249, 232, 241)',
      level3: 'rgb(247, 225, 236)',
      level4: 'rgb(247, 223, 235)',
      level5: 'rgb(245, 218, 231)',
    },
    surfaceDisabled: 'rgba(32, 26, 27, 0.12)',
    onSurfaceDisabled: 'rgba(32, 26, 27, 0.38)',
    backdrop: '#0E101111',
    backgroundDark: '#0E1011',
    // ...MD3LightTheme.colors,
    // backdrop: '#2236', // modal overlay
    // elevation: '#FF0',
    // error: '#F80F00',
    // errorContainer: '#F80F00',
    // inverseOnSurface: '#F00',
    // inversePrimary: '#F00',
    // inverseSurface: '#EDA3C6',
    // surfaceDisabled: '#29434E',
    // onSurfaceDisabled: 'gray',
    // primary: '#EC407A',
    // primaryContainer: '#EC407A',
    // secondary: '#EDA3C6',
    // secondaryContainer: '#EDA3C6',
    // tertiary: '#546E7A',
    // tertiaryContainer: '#546E7A',
    // background: '#FFFFFF',
    // outline: '#BE7896',
    // // surface: '#ffddf1',
    // // scrim: '#F00',
    // // shadow: '#F000',
    // // dark: '#0E1011',
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
