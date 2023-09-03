import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {useAppDispatch} from '../redux/hooks';

// Components
import {
  Button,
  Divider,
  IconButton,
  Portal,
  Surface,
  Text,
  TextInput,
  Modal,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import AvatarDisplay from '../components/AvatarDisplay';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

import {styles} from '../styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Api
import supabaseApi from '../redux/supabaseApi';
import {useGetCurrentProfileQuery} from '../redux/slices/profilesSlice';
import {getUserAvatarUrl, uploadAvatar} from '../supabase/avatars';
import {deleteUser, signOut} from '../supabase/auth';
import {updateUsername} from '../supabase/profiles';
import {StyleSheet} from 'react-native';

export default function Settings(props) {
  const {data: profile} = useGetCurrentProfileQuery();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Username editor
  const [usernameEditorOpen, setUsernameEditorOpen] = useState(false);
  const [usernameFieldText, setUsernameFieldText] = useState('');

  // If we change the username live, then we'll update this so the user sees
  // the change right away
  const [visibleUsername, setVisibleUsername] = useState<string | null>(null);
  const [visibleAvatarUrl, setVisibleAvatarUrl] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  // Actions
  const onLogoutPressed = async () => {
    console.log('[onLogoutPressed] Signing out...');
    dispatch(
      supabaseApi.util.invalidateTags([
        'Chip',
        'Friendship',
        'Goal',
        'Profile',
        'Story',
        'Costreak',
      ]),
    );
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
        // Actually upload the image
        await uploadAvatar(image.uri, image.type, profile?.id, image.fileName);

        // If we were successful, update the local image as well so we can see the change right away
        setVisibleAvatarUrl(getUserAvatarUrl(profile.id, image.fileName));
      }
    }
  };

  // Launches delete modal
  const [isDeleting, setIsDeleting] = useState(false);
  const [manageModalShowing, setManageModalShowing] = useState(false);
  const [areYouSureDelete, setAreYouSureDelete] = useState(false);
  const onManageAccountPressed = () => {
    setManageModalShowing(true);
  };
  const onDismissManageModal = () => {
    setManageModalShowing(false);
    setAreYouSureDelete(false);
  };
  const onDeleteButtonPressed = async () => {
    if (!areYouSureDelete) {
      setAreYouSureDelete(true);
    }

    if (areYouSureDelete && profile) {
      setIsDeleting(true);
      deleteUser(profile.id);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Portal>
        <Modal
          visible={manageModalShowing}
          onDismiss={onDismissManageModal}
          style={localStyles(insets.top).modalWrapperStyle}>
          <Surface style={localStyles(insets.top).modalSurfaceStyle}>
            <Text
              variant="titleLarge"
              style={localStyles(insets.top).modalTitle}>
              Manage account
            </Text>
            <Divider style={styles.dividerLarge} />
            <Divider style={styles.dividerLarge} />
            <Text
              variant="bodyMedium"
              style={localStyles(insets.top).dangerText}>
              Warning: this will delete your account permanently
            </Text>
            <Divider style={styles.dividerMedium} />
            <Button
              mode={areYouSureDelete ? 'contained' : 'outlined'}
              onPress={onDeleteButtonPressed}>
              {isDeleting ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
              ) : areYouSureDelete ? (
                'Are you sure? '
              ) : (
                'Delete account'
              )}
            </Button>
          </Surface>
        </Modal>
      </Portal>
      <Pressable onPress={onCloseUsernameEditor} style={styles.expand}>
        <FocusAwareStatusBar animated={true} barStyle="dark-content" />
        <View {...props} style={localStyles(insets.top).wrapper}>
          <View style={[styles.fullPaddedHorizontal, {height: '100%'}]}>
            <Divider style={styles.dividerSmall} />
            <View style={styles.row}>
              <AvatarDisplay
                url={visibleAvatarUrl}
                self
                width={64}
                height={64}
                previewable
              />
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
            <Divider style={styles.dividerSmall} />
            <Button mode="outlined" onPress={onEditProfilePicturePressed}>
              Edit profile picture
            </Button>
            <Divider style={styles.dividerSmall} />
            <Button mode="contained-tonal" onPress={onManageAccountPressed}>
              Manage account
            </Button>
            <Divider style={styles.dividerLarge} />
            <Text>For more support, please content support@chipgoals.app</Text>
            <Divider style={styles.dividerSmall} />
            <Button
              icon="log-out-outline"
              mode="contained"
              onPress={onLogoutPressed}
              style={localStyles(insets.top).signOutButton}>
              Sign out
            </Button>
          </View>
        </View>
      </Pressable>
    </>
  );
}

const localStyles = (insetsTop: number) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: insetsTop,
    },
    signOutButton: {
      marginTop: 'auto',
      marginBottom: 60,
    },
    modalWrapperStyle: {
      margin: 12,
    },
    modalSurfaceStyle: {
      padding: 16,
      borderRadius: 12,
    },
    modalTitle: {
      textAlign: 'center',
    },
    dangerText: {
      fontWeight: '900',
    },
  });
