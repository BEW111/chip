import {configureFonts, MD3LightTheme} from 'react-native-paper';
import {Fonts, ThemeProp} from 'react-native-paper/lib/typescript/types';

const _fontConfig: Fonts = {
  regular: {
    fontFamily: 'Lato-Regular',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
  },
  light: {
    fontFamily: 'Lato-Light',
    fontWeight: 'normal',
  },
  thin: {
    fontFamily: 'Lato-Thin',
    fontWeight: 'normal',
  },
};

export const theme: ThemeProp = {
  ...MD3LightTheme,
  roundness: 5,
  version: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#EC407A',
    primaryContainer: '#EC407A',
    secondary: '#B4004E',
    tertiary: '#DFA349',
    background: '#FFFFFF',
    outline: '#0000',
    error: '#F80F00',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    default: {
      fontFamily: 'Lato-Regular',
      letterSpacing: 0,
      fontWeight: 'normal',
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: 'Lato-Regular',
      fontWeight: '700',
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: 'Lato-Regular',
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: 'Lato-Regular',
    },
    bodyLarge: {
      fontFamily: 'Lato-Regular',
      letterSpacing: 0,
      fontWeight: '700',
      fontSize: 18,
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: 'Lato-Regular',
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: 'Lato-Regular',
      letterSpacing: 0,
      fontWeight: '700',
      fontSize: 18,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: 'Lato-Regular',
      letterSpacing: 0,
      fontWeight: '700',
    },
  },
};

export default theme;
