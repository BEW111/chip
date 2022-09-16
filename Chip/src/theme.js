import {configureFonts, DefaultTheme} from 'react-native-paper';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Barlow',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Barlow',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Barlow',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Barlow',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Barlow-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Barlow-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Barlow-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Barlow-Thin',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'Barlow',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Barlow',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Barlow',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Barlow',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  ...DefaultTheme,
  roundness: 4,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B4004E',
    secondary: '#EC407A',
    tertiary: '#DFA349',
  },
  fonts: configureFonts(fontConfig),
};

export default theme;
