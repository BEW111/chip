import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {styles} from '../styles';

import backgroundImage from '../../assets/background.png';

const BackgroundWrapper = props => (
  <View style={styles.absoluteFull}>
    <FastImage source={backgroundImage} style={styles.absoluteFull} />
    {props.children}
  </View>
);

export default BackgroundWrapper;
