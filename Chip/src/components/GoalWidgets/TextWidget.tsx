/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {Pressable, View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import BlurSurface from '../BlurSurface';
import {styles} from '../../styles';

export default function TextWidget() {
  return (
    <BlurSurface padding={2}>
      <Text variant="titleSmall" style={styles.widgetTitle}>
        <Icon name={'bulb-outline'} color={'gray'} size={16} /> tip
      </Text>
      <View style={{padding: 10}}>
        <Text variant="bodyMedium">
          Focus on always completing your habits on schedule, even if it's
          something small each time.
        </Text>
      </View>
    </BlurSurface>
  );
}
