/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Linking, Image} from 'react-native';
import {TextInput, IconButton} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';

import {useSelector, useDispatch} from 'react-redux';
import {
  takePhoto,
  toggleViewingPhoto,
  selectPhotoSource,
  updateGoal,
} from '../redux/chipSubmitterSlice';
import {submitChip} from '../utils/postUtils';

// async function submitChip(photoUri: string, goal: string) {
//   const currentdt = new Date();
//   // getBase64(photoUri, (encoding: string) => {
//   //   const chip = {
//   //     photo: encoding,
//   //     goal: goal,
//   //     date: currentdt.toLocaleDateString(),
//   //     time: currentdt.toLocaleTimeString(),
//   //   };
//   //   return chip;
//   // });
// }

function PhotoViewer(props) {
  const dispatch = useDispatch();
  const userGoalText = useSelector(state => state.chipSubmitter.goal);

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
              backgroundColor: 'black',
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
            submitChip(props.photoSource, userGoalText);
          }}
        />
      </View>
    </View>
  );
}

export default function Home() {
  // Camera
  const isFocused = useIsFocused();
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

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
    dispatch(takePhoto(camera));
    dispatch(toggleViewingPhoto());
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
          bottom: 30,
          left: 0,
          right: 0,
        }}>
        <Button mode="contained" onPress={onPhotoButtonPress} icon="camera">
          Take photo
        </Button>
      </View>
    </View>
  );
}
