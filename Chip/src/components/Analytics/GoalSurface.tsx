import React from 'react';

import {View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

export default function GoalSurface() {
  return (
    <Surface
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        padding: 12,
        elevation: 0,
        borderRadius: 10,
      }}>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 4,
            marginTop: -2,
          }}>
          Cook more
        </Text>
        <Text style={{fontSize: 18}}>
          <Icon name="flame-outline" size={18} color="#000" /> 5 days
        </Text>
      </View>
      <View style={{justifyContent: 'center'}}>
        <Icon name="chevron-forward-outline" size={30} color="#000" />
      </View>
    </Surface>
  );
}
