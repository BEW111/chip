import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {styles, modalStyles} from '../../styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../../redux/hooks';

// Components
import {Portal, Modal, Text, IconButton, Button} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import pluralize from 'pluralize';

import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

// Animations and gestures
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Data
import {SupabaseChip} from '../../types/chips';
import {SupabaseGoal} from '../../types/goals';

// Supabase and state
import {selectUid} from '../../redux/slices/authSlice';
import {supabase} from '../../supabase/supabase';
import {useDeleteChipMutation} from '../../redux/slices/chipsSlice';

type ChipModalProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  chip: SupabaseChip;
  chipImageUri: string | null;
  goal: SupabaseGoal;
};

function ChipModal({
  visible,
  setVisible,
  chip,
  chipImageUri,
  goal,
}: ChipModalProps) {
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
  const [deleteChip] = useDeleteChipMutation();

  function onPromptDeleteChip() {
    setDeleteModalVisible(true);
  }

  function onDeleteChip() {
    setDeleteModalVisible(false);
    setVisible(false);
    deleteChip(chip.id);
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
              {chipImageUri ? (
                <Pressable>
                  <FastImage source={{uri: chipImageUri}} style={styles.full} />
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
            <Text variant="titleMedium" style={localStyles.whiteText}>
              {new Date(chip.created_at).toLocaleDateString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text variant="titleMedium" style={localStyles.whiteText}>
              {new Date(chip.created_at).toLocaleTimeString()}
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
            <Text variant="titleMedium" style={localStyles.whiteText}>
              {goal.name} - {chip.amount}{' '}
              {pluralize(goal.iteration_units, chip.amount)}
            </Text>
            {chip.description && (
              <Text variant="titleSmall" style={localStyles.whiteText}>
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

type ChipDisplayMiniProps = {
  chip: SupabaseChip;
  goal: SupabaseGoal;
};

export default function ChipDisplayMini({chip, goal}: ChipDisplayMiniProps) {
  const uid = useAppSelector(selectUid);

  // Animations
  const viewScale = useSharedValue(1);
  const viewAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: viewScale.value}],
      opacity: viewScale.value,
    };
  });

  // Selection
  const [selected, setSelected] = useState(false);
  const onPressOut = () => {
    viewScale.value = withSpring(1, {
      damping: 10,
      mass: 0.1,
      stiffness: 100,
    });
    setSelected(true);
  };
  const onLongPress = () => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    viewScale.value = withSpring(4, {
      damping: 10,
      mass: 0.2,
      stiffness: 100,
    });
    setSelected(true);
  };

  // Update the photo
  const [chipImageUri, setChipImageUri] = useState<string | null>(null);
  useEffect(() => {
    const updateChipPhoto = async () => {
      try {
        const downloadPath = `${uid}/${chip.photo_path}`;
        const {data, error} = await supabase.storage
          .from('chips')
          .download(downloadPath);

        if (error) {
          throw error;
        }

        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setChipImageUri(fr.result as string);
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error downloading image: ', error.message);
        }
      }
    };

    updateChipPhoto();
  }, [chip.photo_path, uid]);

  return (
    <>
      <Portal>
        <ChipModal
          visible={selected}
          chipImageUri={chipImageUri}
          setVisible={setSelected}
          chip={chip}
          goal={goal}
        />
      </Portal>
      <Animated.View style={viewAnimatedStyles}>
        <Pressable
          onPressIn={() => {
            viewScale.value = withSpring(1.05, {
              damping: 10,
              mass: 0.1,
              stiffness: 100,
              overshootClamping: true,
            });
          }}
          onPressOut={onPressOut}
          onLongPress={onLongPress}>
          <View style={styles.full}>
            {chipImageUri ? (
              <FastImage
                source={{uri: chipImageUri}}
                style={localStyles.imageDisplay}
              />
            ) : (
              <ShimmerPlaceHolder
                style={localStyles.imageTempDisplay}
                LinearGradient={LinearGradient}
              />
            )}
            <View style={styles.absoluteFullCentered}>
              <Text variant="headlineSmall" style={localStyles.whiteText}>
                {new Date(chip.created_at).toLocaleDateString([], {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                })}
              </Text>
              <Text variant="headlineSmall" style={localStyles.whiteText}>
                {new Date(chip.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </>
  );
}

const localStyles = StyleSheet.create({
  whiteText: {color: 'white'},
  imageDisplay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
  },
  imageTempDisplay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
  },
});
