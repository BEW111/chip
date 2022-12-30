import React, {useState} from 'react';

import {Pressable, View} from 'react-native';

import {
  Button,
  Divider,
  Drawer,
  IconButton,
  Text,
  TextInput,
} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';

import FastImage from 'react-native-fast-image';

import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/authSlice';
import {styles} from '../styles';

import profileDefault from '../../assets/profile-default.png';
import {updateUsername} from '../firebase/auth';

export default function Settings(props) {
  const user = useSelector(selectUser);

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameText, setUsernameText] = useState(user.displayName);
  const [currentUsername, setCurrentUsername] = useState(user.displayName);

  function onLogoutPressed() {
    auth().signOut();
  }

  function onUpdateUsernamePressed() {
    const result = updateUsername(usernameText);

    if (result.status === 'error') {
      console.log('[onLogoutPressed] Error occurred while editing username');
    } else {
      setEditingUsername(false);
      setCurrentUsername(usernameText);
    }
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
            <View style={styles.row}>
              {editingUsername ? (
                <TextInput
                  dense
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={usernameText}
                  onChangeText={text => setUsernameText(text)}
                  contentStyle={{
                    marginBottom: -8,
                    marginHorizontal: -4,
                    width: 150,
                  }}
                />
              ) : (
                <Text variant="titleMedium">@{currentUsername}</Text>
              )}
              {editingUsername ? (
                <IconButton
                  icon={'checkmark-outline'}
                  size={20}
                  style={{margin: -2}}
                  onPress={onUpdateUsernamePressed}
                />
              ) : (
                <IconButton
                  icon={'create-outline'}
                  size={20}
                  style={{margin: -2}}
                  onPress={() => setEditingUsername(true)}
                />
              )}
            </View>
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
