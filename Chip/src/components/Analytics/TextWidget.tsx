/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {Pressable, View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const subtitleMap = {
  streak: {
    icon: 'flame-outline',
    color: '#FF6B00',
  },
  hint: {
    icon: 'bulb-outline',
    color: '#685f0e',
  },
  scheduled: {
    icon: 'alarm-outline',
  },
  todo: {
    icon: 'sync-circle-outline',
  },
  completed: {
    icon: 'checkmark-circle-outline',
    color: '#478E00',
  },
};

export default function TextWidget({subtitle, subtitleType = 'none'}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}>
      <Surface
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: 12,
          elevation: 0,
          borderRadius: 10,
          backgroundColor: '#FFEEF8',
          opacity: pressed ? 0.8 : 1.0,
        }}>
        <Text style={{fontSize: 18, color: subtitleMap[subtitleType]?.color}}>
          {subtitleType != 'none' && (
            <>
              <Icon
                name={subtitleMap[subtitleType].icon}
                size={18}
                color={subtitleMap[subtitleType].color}
              />
              <Text> </Text>
            </>
          )}
          {subtitle}
        </Text>
      </Surface>
    </Pressable>
  );
}
