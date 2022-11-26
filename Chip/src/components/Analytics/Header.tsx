/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Image} from 'react-native';

import {
  IconButton,
  Portal,
  Button,
  Text,
  Menu,
  Modal,
  TextInput,
  Divider,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useSelector, useDispatch} from 'react-redux';
import {selectUid} from '../../redux/authSlice';
import {updateSelectedGoal} from '../../redux/analyticsSlice';

export default function Header(props, {navigation}) {
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
      <Divider style={{height: 2}} />
    </>
  );
}
