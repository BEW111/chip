/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useState, useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View, Linking, Pressable} from 'react-native';

// Components
import FastImage from 'react-native-fast-image';
import {IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';

// Camera
import {
  useCameraDevices,
  Camera,
  PhotoFile,
  TakePhotoOptions,
} from 'react-native-vision-camera';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {CameraPositionMode, CameraFlashMode} from '../types/camera';

// Camera button components
import PhotoViewer from '../components/Track/PhotoViewer';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import pictureButtonOutside from '../../assets/picture-button-outside.png';
import pictureButtonInside from '../../assets/picture-button-inside.png';
import videoButtonOutside from '../../assets/video-button-outside.png';

// Animation
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

// Taking photo actions
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  selectViewingPhoto,
  takePhotoSuccess,
  takePhotoFailure,
  viewingPhotoStart,
} from '../redux/slices/cameraSlice';

// Loading goals data
import {usePrefetch} from '../redux/slices/goalsSlice';
import Tooltip from '../components/common/Tooltip';

// Tutorial state
import {
  selectTutorialStage,
  updateTutorialStage,
} from '../redux/slices/tutorialSlice';

export default function Track() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  // Tutorial stage state
  const tutorialStage = useAppSelector(selectTutorialStage);

  // TODO: this is a workaround bc we need to wait for the transition to finish
  useFocusEffect(
    useCallback(() => {
      console.log('[Track] useFocusEffect waiting');
      if (tutorialStage === 'track-wait-take-photo-transition') {
        setTimeout(
          () => dispatch(updateTutorialStage('track-wait-take-photo')),
          1000,
        );
      }
    }, [dispatch, tutorialStage]),
  );

  // Camera
  const camera = useRef<Camera>(null);
  // const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  // const zoom = useSharedValue(0);
  // const isPressingButton = useSharedValue(false);

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

  // Camera settings
  const [cameraPosition, setCameraPosition] =
    useState<CameraPositionMode>('front');
  const [flash, setFlash] = useState<CameraFlashMode>('off');

  // const supportsCameraFlipping = useMemo(
  //   () => devices.back != null && devices.front != null,
  //   [devices.back, devices.front],
  // );
  // const supportsFlash = device?.hasFlash ?? false;

  const onFlipDevicePressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'on' ? 'off' : 'on'));
  }, []);

  const isFocused = useIsFocused();
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices[cameraPosition];

  // Prefetch goals (TODO: ? idk why I am doing this, check later)
  const prefetchGoals = usePrefetch('getGoals');
  useEffect(() => {
    prefetchGoals([]);
  }, [prefetchGoals]);

  // Animated zoom
  // const minZoom = device?.minZoom ?? 1;
  // const MAX_ZOOM_FACTOR = 20;
  // const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  // Takes the photo
  const onPhotoButtonPress = async () => {
    console.log('[onPhotoButtonPress]');

    // Take the actual photo, this will also toggle the photo viewer when complete
    if (camera.current) {
      const options: TakePhotoOptions = {
        flash: flash,
        qualityPrioritization: 'speed',
      };

      try {
        const photo: PhotoFile = await camera.current.takePhoto(options);
        const photoPath = photo.path;

        dispatch(takePhotoSuccess(photoPath));
        dispatch(viewingPhotoStart());

        // Update tutorial state
        if (tutorialStage === 'track-wait-take-photo') {
          dispatch(updateTutorialStage('track-entering-chip-info'));
        }
      } catch (e: unknown) {
        if (typeof e === 'string') {
          dispatch(takePhotoFailure(e));
        } else if (e instanceof Error) {
          dispatch(takePhotoFailure(e.message));
        }
      }
    } else {
      dispatch(
        takePhotoFailure(
          'Failed to find current camera reference while taking photo',
        ),
      );
    }
  };

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
  const viewingPhoto = useAppSelector(selectViewingPhoto);

  return (
    <View style={{flex: 1, backgroundColor: 'black', justifyContent: 'center'}}>
      <FocusAwareStatusBar animated={true} barStyle="dark-content" />
      <Animated.View
        style={{flex: 1, backgroundColor: 'black'}}
        key={'uniqueKey'}
        entering={FadeIn.duration(100)}
        exiting={FadeOut.duration(100)}>
        {device != null && (
          <Camera
            zoom={device.neutralZoom}
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isFocused && !viewingPhoto}
            photo={true}
            enableZoomGesture
          />
        )}
      </Animated.View>
      {viewingPhoto ? (
        <PhotoViewer />
      ) : (
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
      )}
      {/* Outside of the photo button */}
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
        <Tooltip
          text="Now track your progress by submitting your first chip!"
          visible={tutorialStage === 'track-wait-take-photo'}>
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
        </Tooltip>
      </View>

      {/* Inside of the photo button */}
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
