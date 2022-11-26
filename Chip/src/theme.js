import {configureFonts, MD2LightTheme} from 'react-native-paper';

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
};

const fontConfig = {
  web: _fontConfig,
  ios: _fontConfig,
  android: _fontConfig,
};

const theme = {
  ...MD2LightTheme,
  roundness: 10,
  colors: {
    ...MD2LightTheme.colors,
    primary: '#B4004E',
    secondary: '#EC407A',
    tertiary: '#DFA349',
  },
  fonts: configureFonts({config: fontConfig, isV3: false}),
};

export default theme;
