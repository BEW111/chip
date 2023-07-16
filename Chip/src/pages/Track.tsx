/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {StyleSheet, View, Linking, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IconButton, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';

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
} from '../redux/chipSubmitterSlice';

import pictureButtonOutside from '../../assets/picture-button-outside.png';
import pictureButtonInside from '../../assets/picture-button-inside.png';
import videoButtonOutside from '../../assets/video-button-outside.png';

import PhotoViewer from '../components/Track/PhotoViewer';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

export default function Home() {
  const insets = useSafeAreaInsets();

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
  const devices = useCameraDevices('wide-angle-camera');
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
    if (flash === 'off') {
      dispatch(toggleViewingPhoto());
    }
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
      <FocusAwareStatusBar animated={true} barStyle="dark-content" />
      {device != null ? (
        <Camera
          zoom={device.neutralZoom}
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused && !viewingPhoto}
          photo={true}
          enableZoomGesture
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No camera found (likely running on simulator)</Text>
        </View>
      )}
      {viewingPhoto ? (
        <PhotoViewer photoSource={photoSource} />
      ) : (
        <>
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              top: 70,
              right: 10,
            }}>
            <IconButton
              icon="camera-reverse-outline"
              size={24}
              iconColor="white"
              containerColor={'rgba(0, 0, 0, 0.3)'}
              onPress={onFlipDevicePressed}
            />
            <IconButton
              icon={flash === 'on' ? 'flash' : 'flash-off'}
              size={24}
              iconColor="white"
              containerColor={'rgba(0, 0, 0, 0.3)'}
              onPress={onFlashPressed}
            />
          </View>
        </>
      )}
      <View
        pointerEvents={'box-none'}
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
          <FastImage
            source={takingVideo ? videoButtonOutside : pictureButtonOutside}
            style={{
              width: '100%',
              height: '100%',
              opacity: !viewingPhoto,
            }}
          />
        </Animated.View>
      </View>
      <View
        pointerEvents={'box-none'}
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 20,
          left: 0,
          right: 0,

          height: viewingPhoto ? 0 : 100,

          justifyContent: 'center',
        }}>
        <Pressable
          pointerEvents={viewingPhoto ? 'none' : 'auto'}
          disabled={viewingPhoto}
          onPressIn={() => {
            photoButtonScale.value = withSpring(0.2, {
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
            <FastImage
              style={{
                width: '100%',
                height: '100%',
                opacity: !viewingPhoto,
              }}
              source={pictureButtonInside}
            />
          </Animated.View>
        </Pressable>
      </View>
      {/* Safe zone blur */}
      <BlurView
        blurType="light"
        blurAmount={8}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: insets.top,
        }}
      />
    </View>
  );
}