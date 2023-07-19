import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  useGetCurrentProfileQuery,
  useGetProfilesQuery,
} from '../redux/supabaseApi';

interface ProfileImageProps {
  height: number;
  width: number;
  uid?: string;
  self?: boolean;
  url?: string;
}

const AvatarDisplay = (props: ProfileImageProps) => {
  const {
    data: profile,
    error: profileError,
    isLoading: profileIsLoading,
  } = useGetCurrentProfileQuery();

  let image = {
    uri: '',
  };

  if (props.self) {
    if (!profile?.avatar_url) {
      // throw Error('Current profile does not have avatar_url');
    }
    image.uri = profile?.avatar_url;
  } else if (props.url) {
    //
  } else {
    throw Error(
      'AvatarDisplay must have at least one of "uid", "self", or "url" props',
    );
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
