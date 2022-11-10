/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {StyleSheet, View, Linking, Image, Pressable} from 'react-native';
import {IconButton, Text, TextInput, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from 'react-native-wheel-pick';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
import {submitChip} from '../utils/postUtils';
import {selectUid, selectUserGoals} from '../redux/authSlice';

import pictureButtonOutside from '../../assets/picture-button-outside.png';
import pictureButtonInside from '../../assets/picture-button-inside.png';
import videoButtonOutside from '../../assets/video-button-outside.png';

function PhotoViewer(props) {
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const uid = useSelector(selectUid);

  const userGoals = useSelector(selectUserGoals);

  const [popupShowing, setPopupShowing] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [chipDescription, setChipDescription] = useState('');

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {popupShowing ? (
        <Surface
          pointerEvents={'box-none'}
          style={{
            width: '90%',
            height: '40%',

            borderRadius: 10,

            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}>
          <View
            pointerEvents={'box-none'}
            style={{
              flex: 1,

              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Picker
              pointerEvents={'box-none'}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                width: 330,
                height: 250,
                borderRadius: 15,
                justifyContent: 'center',
                overflow: 'hidden',
              }}
              selectedValue={'Exercise'}
              pickerData={[
                ...new Set([
                  ...userGoals,
                  ...['Exercise', 'Eat healthy', 'Study'],
                ]),
              ]}
              onValueChange={value => {
                setSelectedGoal(value);
              }}
            />
          </View>
          <TextInput
            style={{margin: 10}}
            label="Description"
            value={chipDescription}
            onChangeText={text => setChipDescription(text)}
          />
          <Pressable
            onPress={() => setPopupShowing(!popupShowing)}
            style={{
              width: 40,
              height: 40,

              position: 'absolute',
              top: 10,
              right: 10,

              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="close" size={24} />
          </Pressable>
        </Surface>
      ) : (
        <></>
      )}
      <Pressable
        onPress={() => dispatch(toggleViewingPhoto())}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          height: 40,
          width: 40,
          borderRadius: 100,

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          position: 'absolute',
          left: 20,
          top: 0 + insets.top,
        }}>
        <Icon name="close" size={32} color="white" style={{marginLeft: 2}} />
      </Pressable>
      {popupShowing ? (
        <></>
      ) : (
        <Pressable
          onPress={() => setPopupShowing(true)}
          style={{
            backgroundColor: '#FAC576',
            height: 50,
            width: 50,
            borderRadius: 7,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            position: 'absolute',
            right: 20,
            bottom: 120,
          }}>
          <Icon name="create-outline" size={36} style={{marginLeft: 2}} />
        </Pressable>
      )}
      <Pressable
        onPress={() => {
          dispatch(toggleViewingPhoto());
          submitChip(props.photoSource, selectedGoal, chipDescription, uid);
        }}
        style={{
          backgroundColor: '#29E8A5',
          height: 50,
          width: 50,
          borderRadius: 7,

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          position: 'absolute',
          right: 20,
          bottom: 30,
        }}>
        <Icon
          name="checkmark-circle-outline"
          size={36}
          style={{marginLeft: 2}}
          color={'black'}
        />
      </Pressable>
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
              color="white"
              onPress={onFlipDevicePressed}
              style={{
                borderColor: 'white',
                borderWidth: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
            />
            <IconButton
              icon={flash === 'on' ? 'flash' : 'flash-off'}
              size={24}
              color="white"
              onPress={onFlashPressed}
              style={{
                borderColor: 'white',
                borderWidth: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
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
          <Image
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

          height: 100,
          justifyContent: 'center',
        }}>
        <Pressable
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
            <Image
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
    </View>
  );
}
