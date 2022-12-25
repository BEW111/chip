import React from 'react';

import {Pressable, View} from 'react-native';

import {Button, Divider, Drawer, IconButton, Text} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';

import FastImage from 'react-native-fast-image';

import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/authSlice';
import {styles} from '../styles';

import profileDefault from '../../assets/profile-default.png';

export default function Settings(props) {
  const user = useSelector(selectUser);

  function onLogoutPressed() {
    // console.log('logging out');
    auth().signOut();
    // .then(() => console.log('User signed out!'));
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.fullPaddedHorizontal}>
        <IconButton
          icon={'chevron-back-outline'}
          size={32}
          style={{margin: -2}}
          onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
        />
        <Divider style={styles.dividerMedium} />
        <View style={styles.row}>
          <FastImage source={profileDefault} style={{width: 64, height: 64}} />
          <Divider style={styles.dividerHSmall} />
          <View>
            <Text variant="titleMedium">username</Text>
            <Text variant="titleSmall">{user.email}</Text>
          </View>
        </View>
        <Divider style={styles.dividerMedium} />
        <Button
          icon="log-out-outline"
          mode="outlined"
          onPress={onLogoutPressed}>
          Sign out
        </Button>
      </View>
    </DrawerContentScrollView>
  );
}
