import {configureFonts, DefaultTheme} from 'react-native-paper';

const _fontConfig = {
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
  
}

const fontConfig = {
  web: _fontConfig,
  ios: _fontConfig,
  android: _fontConfig,
};

const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B4004E',
    secondary: '#EC407A',
    tertiary: '#DFA349',
  },
  fonts: configureFonts(fontConfig),
};

export default theme;
