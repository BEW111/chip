import React from 'react';

import {Drawer, Text} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';

import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/authSlice';

export default function Settings(props) {
  const user = useSelector(selectUser);

  function onLogoutPressed() {
    console.log('logging out');
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  return (
    <DrawerContentScrollView {...props}>
      <Text
        style={{
          marginLeft: 15,
          fontSize: 24,
          marginBottom: 10,
          color: 'black',
        }}>
        {user.email}
      </Text>
      <Drawer.Item
        style={{backgroundColor: 'black'}}
        icon="logout"
        label="Sign out"
        onPress={onLogoutPressed}
      />
    </DrawerContentScrollView>
  );
}