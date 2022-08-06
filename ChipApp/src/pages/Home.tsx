import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';

export default function Home() {
  const devices = useCameraDevices()
  const device = devices.back

  if (device == null) return <Text>loading...</Text>
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}