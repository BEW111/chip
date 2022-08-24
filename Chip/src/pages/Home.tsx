/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {StyleSheet, View, Linking, Image, Pressable} from 'react-native';
import {TextInput, IconButton, Text} from 'react-native-paper';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

import {useSelector, useDispatch} from 'react-redux';
import {
  takePhoto,
  toggleViewingPhoto,
  selectPhotoSource,
  updateGoal,
} from '../redux/chipSubmitterSlice';
import {submitChip} from '../utils/postUtils';
import {selectUid} from '../redux/authSlice';

import pictureButtonOutside from '../../assets/picture-button-outside.png';
import pictureButtonInside from '../../assets/picture-button-inside.png';
import videoButtonOutside from '../../assets/video-button-outside.png';

function PhotoViewer(props) {
  const dispatch = useDispatch();
  const userGoalText = useSelector(state => state.chipSubmitter.goal);
  const uid = useSelector(selectUid);

  return (
    <View
      style={{
        width: '100%',
        position: 'absolute',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          width: 350,
          height: 350,

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={props.photoSource} style={{width: 350, height: 350}} />
        <View
          style={{
            flex: 1,

            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            placeholder="Enter goal here"
            onChangeText={text => dispatch(updateGoal(text))}
            defaultValue={userGoalText}
            style={{
              backgroundColor: 'gray',
              textAlign: 'center',
              flex: 1,
              color: 'white',
              fontSize: 24,
              paddingHorizontal: 15,
            }}
            underlineColor="gray"
            activeUnderlineColor="white"
          />
        </View>
        <IconButton
          icon="arrow-u-left-bottom"
          size={36}
          style={{
            backgroundColor: 'blue',
            position: 'absolute',
            left: 5,
            bottom: 5,
          }}
          onPress={() => dispatch(toggleViewingPhoto())}
        />
        <IconButton
          icon="arrow-right"
          size={36}
          style={{
            backgroundColor: 'blue',
            position: 'absolute',
            right: 5,
            bottom: 5,
          }}
          onPress={() => {
            submitChip(props.photoSource, userGoalText, uid);
          }}
        />
      </View>
    </View>
  );
}

export default function Home() {
  // Camera
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  // const zoom = useSharedValue(0);
  // const isPressingButton = useSharedValue(false);

  // Camera settings
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'front',
  );
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const supportsFlash = device?.hasFlash ?? false;

  // Animated zoom
  // const minZoom = device?.minZoom ?? 1;
  // const MAX_ZOOM_FACTOR = 20;
  // const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const onFlipDevicePressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'on' ? 'off' : 'on'));
  }, []);

  // Camera permissions
  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  // Taking a photo
  const photoSource = useSelector(selectPhotoSource);
  const dispatch = useDispatch();

  function onPhotoButtonPress() {
    dispatch(
      takePhoto({
        camera: camera,
        flash: flash,
      }),
    );
    dispatch(toggleViewingPhoto());
  }

  // Take photo button
  const photoButtonScale = useSharedValue(1);
  const photoButtonAnimatedStyles = useAnimatedStyle(() => {
    return {
      width: 68 * photoButtonScale.value,
      height: 68 * photoButtonScale.value,
    };
  });

  // Taking a video
  const [takingVideo, setTakingVideo] = useState(false);
  const videoButtonRotation = useSharedValue(0);
  const videoButtonAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${videoButtonRotation.value}deg`,
        },
      ],
    };
  }, [videoButtonRotation.value]);

  useEffect(() => {
    videoButtonRotation.value = withRepeat(
      withTiming(360, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
    );
    return () => cancelAnimation(videoButtonRotation);
  }, [videoButtonRotation]);

  function startTakingVideo() {
    setTakingVideo(true);
  }

  function stopTakingVideo() {
    setTakingVideo(false);
  }

  // Viewing/editing a photo
  const viewingPhoto = useSelector(state => state.chipSubmitter.viewingPhoto);

  return (
    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
      {device != null ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused}
          photo={true}
          enableZoomGesture
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No camera found (likely running on simulator)</Text>
        </View>
      )}
      {viewingPhoto ? <PhotoViewer photoSource={photoSource} /> : <></>}
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          top: 70,
          right: 10,
        }}>
        <IconButton
          icon="camera-flip-outline"
          size={32}
          onPress={onFlipDevicePressed}
          style={{
            borderColor: 'white',
            borderWidth: 1,
          }}
        />
        <IconButton
          icon={flash === 'on' ? 'flash' : 'flash-off'}
          size={32}
          onPress={onFlashPressed}
          style={{
            borderColor: 'white',
            borderWidth: 1,
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 20,
          left: 0,
          right: 0,

          height: 100,
          justifyContent: 'center',
        }}>
        <Animated.View
          style={[videoButtonAnimatedStyles, {width: 84, height: 84}]}>
          <Image
            source={takingVideo ? videoButtonOutside : pictureButtonOutside}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Animated.View>
      </View>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 20,
          left: 0,
          right: 0,

          height: 100,
          justifyContent: 'center',
        }}>
        <Pressable
          onPressIn={() => {
            photoButtonScale.value = withSpring(0.9, {
              damping: 10,
              stiffness: 200,
            });
          }}
          onPressOut={() => {
            photoButtonScale.value = withSpring(1, {
              damping: 10,
              stiffness: 200,
            });
            if (takingVideo) {
              stopTakingVideo();
            }
          }}
          onPress={onPhotoButtonPress}
          onLongPress={() => {
            startTakingVideo();
          }}>
          <Animated.View style={photoButtonAnimatedStyles}>
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              source={pictureButtonInside}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}
