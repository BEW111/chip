/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Pressable, View, Text} from 'react-native';

import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {selectUid} from '../../redux/authSlice';

import storage from '@react-native-firebase/storage';

export default function ChipDisplayMini({chip, index}) {
  const uid = useSelector(selectUid);
  const path = `user/${uid}/chip-photo/${chip.photo}`;
  const [downloadURL, setDownloadURL] = useState('');

  const viewScale = useSharedValue(1);
  const viewAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: viewScale.value}],
      opacity: viewScale.value,
    };
  });

  const onLongPress = () => {
    viewScale.value = withSpring(2, {
      damping: 10,
      mass: 0.1,
      stiffness: 100,
    });
    console.log(index);
  };

  useEffect(() => {
    async function grabURL() {
      const newURL = await storage().ref(path).getDownloadURL();
      setDownloadURL(newURL);
    }
    grabURL();
  }, [path]);

  return (
    <Animated.View style={viewAnimatedStyles}>
      <Pressable
        onPressIn={() => {
          viewScale.value = withSpring(0.95, {
            damping: 10,
            mass: 0.1,
            stiffness: 100,
            overshootClamping: true,
          });
        }}
        onPressOut={() => {
          viewScale.value = withSpring(1, {
            damping: 10,
            mass: 0.1,
            stiffness: 100,
          });
        }}
        onLongPress={onLongPress}
        onPress={() => console.log('press')}>
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          {downloadURL ? (
            <FastImage
              source={{uri: downloadURL}}
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                borderRadius: 16,
              }}
            />
          ) : (
            <></>
          )}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 24, fontWeight: '700'}}>
              {index}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
