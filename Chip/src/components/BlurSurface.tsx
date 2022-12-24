import React from 'react';
import {StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';

const BlurSurface = props => (
  <BlurView
    blurType="light"
    blurAmount={32}
    style={StyleSheet.compose(localStyles.blurSurface, props?.style)}>
    {props.children}
  </BlurView>
);

export default BlurSurface;

const localStyles = StyleSheet.create({
  blurSurface: {
    padding: 15,
    borderRadius: 10,
  },
});
