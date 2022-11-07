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

import {addGoal} from '../../utils/postUtils';

export default function Header({title, navigation}) {
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
          <View style={{position: 'absolute', display: 'flex', right: 10}}>
            <IconButton
              icon="cog"
              size={36}
              style={{
                marginVertical: -5,
              }}
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
          </View>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>{title}</Text>
        </View>
      </View>
      <Divider style={{height: 2}} />
    </>
  );
}
