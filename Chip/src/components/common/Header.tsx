/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

import {Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function Header(props) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={{
          backgroundColor: '#ffffff28',
          paddingTop: insets.top,
          paddingBottom: 12,
        }}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          {props.children}
        </View>
      </View>
      <Divider style={{height: 1}} />
    </>
  );
}
