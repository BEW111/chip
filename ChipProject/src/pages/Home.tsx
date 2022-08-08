import React from 'react';
import {useCallback, useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, Button, Linking, Image} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';

export default function Home() {
  const isFocused = useIsFocused();

  const camera = useRef<Camera>(null);
  const takePicture = async function () {
    const photo = await camera.current.takePhoto({
      flash: 'on',
    });
    console.log(photo.path);
    setPhotoSource({
      isStatic: true,
      uri: photo.path,
    });
  };
  const [photoSource, setPhotoSource] = useState({});
  

  // Camera
  const devices = useCameraDevices();
  const device = devices.back;

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  if (device == null) {
    return <Text>loading...</Text>;
  }
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        photo={true}
        enableZoomGesture
      />
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 30,
          left: 0,
          right: 0,
        }}>
        <Button title="Take picture" onPress={takePicture} />
      </View>
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          width: 100,
          height: 100,
          top: 50,
          left: 50,
        }}>
        <Image source={photoSource} style={{width: 100, height: 100}} />
      </View>
    </View>
  );
}
