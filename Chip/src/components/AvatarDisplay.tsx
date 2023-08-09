import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import {Portal, Modal} from 'react-native-paper';

import DefaultProfileImage from '../../assets/profile-default.png';

import {useGetCurrentProfileQuery} from '../redux/slices/profilesSlice';

interface ProfileImageProps {
  height: number;
  width: number;
  uid?: string;
  self?: boolean;
  url?: string | null;
  previewable?: boolean;
}

const AvatarDisplay = (props: ProfileImageProps) => {
  const {data: profile} = useGetCurrentProfileQuery();

  let image = {
    uri: '',
  };

  // Specifying a specific url takes precedence over specifying that
  // you want this to be for the user's own profile
  if (props.url != null) {
    image.uri = props.url;
  } else if (props.self) {
    if (profile?.avatar_url) {
      image.uri = profile?.avatar_url;
    } else {
      image = DefaultProfileImage;
    }
  } else {
    image = DefaultProfileImage;
  }

  // Image preview
  const [previewVisible, setPreviewVisible] = useState(false);
  const onOpenPreview = () => {
    setPreviewVisible(true);
  };
  const onClosePreview = () => {
    setPreviewVisible(false);
  };

  return (
    <>
      {props.previewable !== null && props.previewable && (
        <Portal>
          <Modal visible={previewVisible} onDismiss={onClosePreview}>
            <Pressable onPress={onClosePreview}>
              <View style={styles(props.height, props.width).previewWrapper}>
                <FastImage
                  source={image}
                  style={styles(props.height, props.width).profileImagePreview}
                />
              </View>
            </Pressable>
          </Modal>
        </Portal>
      )}
      <Pressable onPress={onOpenPreview}>
        <FastImage
          source={image}
          style={styles(props.height, props.width).profileImage}
        />
      </Pressable>
    </>
  );
};

export default AvatarDisplay;

const styles = (height: number, width: number) =>
  StyleSheet.create({
    profileImage: {
      height: height,
      width: width,
      borderRadius: 100,
    },
    profileImagePreview: {
      height: 128,
      width: 128,
      borderRadius: 100,
    },
    previewWrapper: {
      width: '100%',
      alignItems: 'center',
    },
  });
