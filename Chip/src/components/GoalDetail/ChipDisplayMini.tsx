/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Pressable, View} from 'react-native';
import {Portal, Modal, Text, IconButton, Button} from 'react-native-paper';

import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import pluralize from 'pluralize';

import {selectUid} from '../../redux/slices/authSlice';

import storage from '@react-native-firebase/storage';
import {styles, modalStyles} from '../../styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {deleteChip} from '../../firebase/chips';

function ChipModal({visible, setVisible, downloadURL, chip, goal}) {
  // Animation
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

  function dismiss() {
    setVisible(false);
    offset.value = {x: 0, y: 0};
    start.value = {x: 0, y: 0};
    scale.value = withSpring(1);
    savedScale.value = 1;
    rotation.value = withSpring(0);
    savedRotation.value = 0;
  }

  // Deleting the chip
  const uid = useSelector(selectUid);

  function onPromptDeleteChip() {
    console.log('delete chip');
    setDeleteModalVisible(true);
  }

  function onDeleteChip() {
    setDeleteModalVisible(false);
    setVisible(false);
    deleteChip(uid, chip.id);
  }

  const insets = useSafeAreaInsets();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  return (
    <>
      <Modal
        style={{backgroundColor: '#000C', marginTop: 0, marginBottom: 0}}
        visible={visible}
        onDismiss={dismiss}>
        <Pressable onPress={dismiss}>
          <GestureDetector gesture={composed}>
            <Animated.View style={[styles.full, animatedStyles]}>
              {downloadURL ? (
                <Pressable>
                  <FastImage source={{uri: downloadURL}} style={styles.full} />
                </Pressable>
              ) : (
                <></>
              )}
            </Animated.View>
          </GestureDetector>
        </Pressable>
        <View style={styles.absoluteFull} pointerEvents="box-none">
          <View
            style={{
              backgroundColor: 'black',
              paddingTop: insets.top,
              alignItems: 'center',
              paddingBottom: 10,
            }}>
            <Text variant="titleMedium" style={{color: 'white'}}>
              {chip.timeSubmitted.toDate().toLocaleDateString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text variant="titleMedium" style={{color: 'white'}}>
              {chip.timeSubmitted.toDate().toLocaleTimeString()}
            </Text>
            <IconButton
              onPress={dismiss}
              icon="chevron-back-outline"
              iconColor="white"
              style={{position: 'absolute', left: 12, marginTop: insets.top}}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              backgroundColor: 'black',
              paddingBottom: insets.bottom,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 20,
            }}>
            <Text variant="titleMedium" style={{color: 'white'}}>
              {goal.name} - {chip.amount} {pluralize(goal.units, chip.amount)}
            </Text>
            {chip.description && (
              <Text variant="titleSmall" style={{color: 'white'}}>
                Notes: {chip.description}
              </Text>
            )}
            <View
              style={{
                position: 'absolute',
                right: 16,
                bottom: 0,
                top: 0,
                justifyContent: 'center',
              }}>
              <IconButton
                onPress={onPromptDeleteChip}
                icon="trash-outline"
                iconColor="white"
                size={28}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* Deleting a chip */}
      <Modal
        visible={deleteModalVisible}
        onDismiss={() => setDeleteModalVisible(false)}
        contentContainerStyle={modalStyles.container}>
        <Text style={modalStyles.header}>Delete chip</Text>
        <Button mode="contained" onPress={onDeleteChip}>
          Confirm
        </Button>
      </Modal>
    </>
  );
}

export default function ChipDisplayMini({chip, goal}) {
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
    viewScale.value = withSpring(4, {
      damping: 10,
      mass: 0.2,
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
          chip={chip}
          goal={goal}
        />
      </Portal>
      <Animated.View style={viewAnimatedStyles}>
        <Pressable
          onPressIn={() => {
            // ReactNativeHapticFeedback.trigger('impactLight');
            viewScale.value = withSpring(1.05, {
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
          onLongPress={onLongPress}>
          <View style={styles.full}>
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
            <View style={styles.absoluteFullCentered}>
              <Text variant="headlineSmall" style={{color: 'white'}}>
                {chip.timeSubmitted.toDate().toLocaleDateString([], {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                })}
              </Text>
              <Text variant="headlineSmall" style={{color: 'white'}}>
                {chip.timeSubmitted
                  .toDate()
                  .toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </>
  );
}
