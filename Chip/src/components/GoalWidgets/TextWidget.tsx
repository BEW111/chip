/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {View} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import BlurSurface from '../BlurSurface';
import {styles} from '../../styles';

type TextWidgetProps = {
  title: string;
  text: string;
  icon: string;
};

export default function TextWidget({icon, text, title}: TextWidgetProps) {
  return (
    <BlurSurface padding={2}>
      <Text variant="titleSmall" style={styles.widgetTitle}>
        <Icon name={icon} color={'gray'} size={16} />
        <Divider style={styles.dividerHTiny} />
        {title}
      </Text>
      <View style={{padding: 10}}>
        <Text variant="bodyMedium">{text}</Text>
      </View>
    </BlurSurface>
  );
}
