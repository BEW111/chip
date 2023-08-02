import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import DefaultProfileImage from '../../assets/profile-default.png';

import {useGetCurrentProfileQuery} from '../redux/slices/profilesSlice';

interface ProfileImageProps {
  height: number;
  width: number;
  uid?: string;
  self?: boolean;
  url?: string | null;
}

const AvatarDisplay = (props: ProfileImageProps) => {
  const {data: profile} = useGetCurrentProfileQuery();

  let image = {
    uri: '',
  };

  // Specifying a specific url takes precedence over specifying that
  // you want this to be for the user's own profile
  if (props.url) {
    image.uri = props.url;
  } else if (props.self) {
    if (profile?.avatar_url) {
      image.uri = profile?.avatar_url;
    }
  } else {
    image = DefaultProfileImage;
  }

  return (
    <FastImage
      source={image}
      style={styles(props.height, props.width).profileImage}
    />
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
  });
