import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import storage from '@react-native-firebase/storage';

import {selectUid} from '../redux/slices/authSlice';
import profileDefault from '../../assets/profile-default.png';
import {ProfileImage} from '../types';

interface ProfileImageProps {
  height: number;
  width: number;
  uid?: string;
  self?: boolean;
  profileImage?: ProfileImage;
}

const ProfileImageDisplay = (props: ProfileImageProps) => {
  const [publicProfileImage, setPublicProfileImage] = useState<{
    uri: string;
  } | null>(null);
  const uid = useSelector(selectUid);

  useEffect(() => {
    async function setUserProfileImage() {
      if (props?.uid || props?.self) {
        const path = `user/${
          props?.self ? uid : props.uid
        }/profile-image/profile`;
        try {
          const newURL = await storage().ref(path).getDownloadURL();
          setPublicProfileImage({
            uri: newURL,
          });
        } catch {
          console.error(`No profile image found for user ${props.uid}`);
        }
      }
    }

    setUserProfileImage();
  }, [props?.uid, props?.self, uid]);

  const img = () => {
    if (publicProfileImage) {
      return publicProfileImage;
    }

    return profileDefault;
  };

  return (
    <FastImage
      source={img()}
      style={styles(props.height, props.width).profileImage}
    />
  );
};

export default ProfileImageDisplay;

const styles = (height: number, width: number) =>
  StyleSheet.create({
    profileImage: {
      height: height,
      width: width,
      borderRadius: 100,
    },
  });
