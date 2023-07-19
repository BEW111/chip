import React, {useState, useEffect} from 'react';
import {Pressable, View} from 'react-native';

// Components
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  Text,
  TextInput,
} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {launchImageLibrary} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import AvatarDisplay from '../components/AvatarDisplay';

import {styles} from '../styles';

// Api
import {useGetCurrentProfileQuery} from '../redux/supabaseApi';
import {uploadAvatar} from '../supabase/storage';
import {signOut} from '../supabase/auth';
import {updateUsername} from '../supabase/profile';

export default function Settings(props) {
  const {
    data: profile,
    error: profileError,
    isLoading: profileIsLoading,
  } = useGetCurrentProfileQuery();

  // Username editor
  const [usernameEditorOpen, setUsernameEditorOpen] = useState(false);
  const [usernameFieldText, setUsernameFieldText] = useState('');

  // If we change the username live, then we'll update this so the user sees
  // the change right away
  const [visibleUsername, setVisibleUsername] = useState<string | null>(null);

  const onLogoutPressed = () => {
    signOut();
  };

  const onOpenUsernameEditor = () => {
    setUsernameFieldText(visibleUsername || profile?.username || '');
    setUsernameEditorOpen(true);
  };

  const onCloseUsernameEditor = () => {
    setUsernameEditorOpen(false);
  };

  const onUpdateUsernamePressed = () => {
    updateUsername(usernameFieldText);
    setVisibleUsername(usernameFieldText);
    setUsernameEditorOpen(false);

    // Update username here
    // if (result.status === 'error') {
    //   console.log('[onLogoutPressed] Error occurred while editing username');
    // } else {
    //   setEditingUsername(false);
    //   setCurrentUsername(profileDefault);
    // }
  };

  // Launches the profile picture library
  const onEditProfilePicturePressed = async () => {
    // Waits until we select or cancel
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorMessage) {
      throw result.errorMessage;
    }

    const assets = result.assets;

    if (assets) {
      const image = assets[0];

      if (image.uri && image.type && profile?.id && image.fileName) {
        await uploadAvatar(image.uri, image.type, profile?.id, image.fileName);
      }
    }
  };

  return (
    <Pressable onPress={onCloseUsernameEditor} style={styles.expand}>
      <DrawerContentScrollView {...props} style={styles.expand}>
        <View style={styles.fullPaddedHorizontal}>
          <View style={styles.row}>
            <AvatarDisplay self width={64} height={64} />
            <Divider style={styles.dividerHSmall} />
            <View>
              <View style={styles.row}>
                {usernameEditorOpen ? (
                  <TextInput
                    dense
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={usernameFieldText}
                    onChangeText={text => setUsernameFieldText(text)}
                    contentStyle={{
                      marginBottom: -8,
                      marginHorizontal: -4,
                      width: 150,
                    }}
                  />
                ) : (
                  <Text variant="titleMedium">
                    @{visibleUsername || profile?.username}
                  </Text>
                )}
                {usernameEditorOpen ? (
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
                    onPress={onOpenUsernameEditor}
                  />
                )}
              </View>
              {/* <Text variant="titleSmall">{user.email}</Text> */}
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
    </Pressable>
  );
}
