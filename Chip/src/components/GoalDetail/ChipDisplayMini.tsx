/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Pressable, View} from 'react-native';
import {Portal, Modal} from 'react-native-paper';

import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {selectUid} from '../../redux/authSlice';

import storage from '@react-native-firebase/storage';
import {styles} from '../../styles';

function ChipModal({visible, setVisible, downloadURL}) {
  const offset = useSharedValue({x: 0, y: 0});
  const start = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
        {scale: scale.value},
        // {rotateZ: `${rotation.value}rad`},
      ],
    };
  });

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const zoomGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate(event => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(
    dragGesture,
    Gesture.Simultaneous(zoomGesture, rotateGesture),
  );

  return (
    <Modal
      style={{backgroundColor: 'black'}}
      visible={visible}
      onDismiss={() => setVisible(false)}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.full, animatedStyles]}>
          {downloadURL ? (
            <FastImage source={{uri: downloadURL}} style={styles.full} />
          ) : (
            <></>
          )}
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

export default function ChipDisplayMini({chip}) {
  const uid = useSelector(selectUid);
  const path = `user/${uid}/chip-photo/${chip.photo}`;
  const [downloadURL, setDownloadURL] = useState('');
  const [selected, setSelected] = useState(false);

  const viewScale = useSharedValue(1);
  const viewAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: viewScale.value}],
      opacity: viewScale.value,
    };
  });

  const onLongPress = () => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    viewScale.value = withSpring(2, {
      damping: 10,
      mass: 0.1,
      stiffness: 100,
    });
    setSelected(true);
  };

  useEffect(() => {
    async function grabURL() {
      const newURL = await storage().ref(path).getDownloadURL();
      setDownloadURL(newURL);
    }
    grabURL();
  }, [path]);

  return (
    <>
      <Portal>
        <ChipModal
          visible={selected}
          downloadURL={downloadURL}
          setVisible={setSelected}
        />
      </Portal>
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
          // onPress={() => setSelected(true)}
        >
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
          </View>
        </Pressable>
      </Animated.View>
    </>
  );
}
