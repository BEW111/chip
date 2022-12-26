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
      fontWeight: '500',
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
