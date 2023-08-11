/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {
  en,
  fr,
  nl,
  de,
  pl,
  pt,
  ar,
  ko,
  enGB,
  registerTranslation,
} from 'react-native-paper-dates';
registerTranslation('en', en);
registerTranslation('fr', fr);
registerTranslation('nl', nl);
registerTranslation('pl', pl);
registerTranslation('pt', pt);
registerTranslation('de', de);
registerTranslation('ar', ar);
registerTranslation('ko', ko);
registerTranslation('en', enGB);

if (!__DEV__) {
  console.log = () => {};
}

AppRegistry.registerComponent(appName, () => App);
