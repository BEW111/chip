/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';

import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {Surface, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import {selectUid} from '../../redux/authSlice';

import storage from '@react-native-firebase/storage';

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default function ChipDisplayMini(props) {
  const uid = useSelector(selectUid);
  const path = `user/${uid}/chip-photo/${props.photo}`;
  const [downloadURL, setDownloadURL] = useState('');

  useEffect(() => {
    async function grabURL() {
      const newURL = await storage().ref(path).getDownloadURL();
      setDownloadURL(newURL);
    }
    grabURL();
  }, [path]);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      {downloadURL ? (
        <FastImage
          source={{uri: downloadURL}}
          style={{
            // position: 'absolute',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 16,
          }}
        />
      ) : (
        <></>
      )}
    </View>
  );
}
