import React from 'react';
import {useCallback, useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, Linking, Image} from 'react-native';
import {Button} from 'react-native-paper';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';

export default function Home() {
  const isFocused = useIsFocused();

  const camera = useRef<Camera>(null);
  const takePicture = async function () {
    if (camera.current != null) {
      const photo = await camera.current.takePhoto({
        flash: 'on',
      });
      setPhotoSource({
        isStatic: true,
        uri: photo.path,
      });
    }
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
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <View style={{backgroundColor: 'red', opacity: 0.5}}>
          <Image source={photoSource} style={{width: 400, height: 400}} />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 30,
          left: 0,
          right: 0,
        }}>
        <Button mode="contained" onPress={takePicture} icon="camera">
          Take picture
        </Button>
      </View>
    </View>
  );
}
