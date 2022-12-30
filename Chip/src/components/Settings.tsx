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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import FastImage from 'react-native-fast-image';

import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {selectUid, selectUser} from '../redux/authSlice';
import {styles} from '../styles';

import profileDefault from '../../assets/profile-default.png';
import {uploadProfileImage, updateUsername} from '../firebase/auth';
import ProfileImage from './ProfileImageDisplay';

export default function Settings(props) {
  const user = useSelector(selectUser);
  const uid = useSelector(selectUid);

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameText, setUsernameText] = useState(user.displayName);
  const [currentUsername, setCurrentUsername] = useState(user.displayName);
  const [profileImage, setProfileImage] = useState(profileDefault);

  function onLogoutPressed() {
    auth().signOut();
  }

  function onUpdateUsernamePressed() {
    const result = updateUsername(usernameText);

    if (result.status === 'error') {
      console.log('[onLogoutPressed] Error occurred while editing username');
    } else {
      setEditingUsername(false);
      setCurrentUsername(profileDefault);
    }
  }

  async function onEditProfilePicturePressed() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });
    if (!result.didCancel && result.assets.length > 0) {
      const source = {uri: result.assets[0].uri};
      await uploadProfileImage(source, uid);
      setProfileImage(source);
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
          <ProfileImage self width={64} height={64} />
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
        <Divider style={styles.dividerTiny} />
        <Button mode="text" onPress={onEditProfilePicturePressed}>
          Edit profile picture
        </Button>
        <Divider style={styles.dividerSmall} />
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
