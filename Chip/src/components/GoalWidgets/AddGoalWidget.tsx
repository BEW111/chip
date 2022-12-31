import React, {useState} from 'react';

import {
  Pressable,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  Portal,
  Modal,
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Divider,
  Surface,
  IconButton,
  useTheme,
} from 'react-native-paper';
import EmojiPicker from 'rn-emoji-keyboard';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import pluralize from 'pluralize';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {useSelector, useDispatch} from 'react-redux';
import {selectUid} from '../../redux/authSlice';

import {addGoal} from '../../firebase/goals';
import {modalStyles, styles} from '../../styles';
import {GoalVisibility} from '../../types';

export default function AddGoalWidget() {
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const theme = useTheme();

  const surfaceScale = useSharedValue(1);
  const surfaceAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: surfaceScale.value}],
    };
  });

  const [goalNameInput, setGoalNameInput] = useState('');
  const [goalEmojiInput, setGoalEmojiInput] = useState({
    emoji: '💪',
  });
  const [goalTypeInput, setGoalTypeInput] = useState('form');
  const [goalFreqInput, setGoalFreqInput] = useState('daily');
  const [goalFreqAmtInput, setGoalFreqAmtInput] = useState(1);
  const [goalUnits, setGoalUnits] = useState('time');
  const [goalVisibility, setGoalVisibility] =
    useState<GoalVisibility>('private');

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const dispatch = useDispatch();

  const uid = useSelector(selectUid);

  return (
    <>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal}>
          <Pressable
            pointerEvents="auto"
            onPress={hideModal}
            style={modalStyles.wrapper}>
            <KeyboardAvoidingView>
              <Pressable onPress={Keyboard.dismiss}>
                <Surface style={modalStyles.container}>
                  <Text style={modalStyles.header}>Add a new habit</Text>
                  <View style={styles.row}>
                    <View style={styles.expand}>
                      <TextInput
                        style={modalStyles.textInput}
                        mode="outlined"
                        label="Habit name"
                        value={goalNameInput}
                        onChangeText={text => setGoalNameInput(text)}
                      />
                    </View>
                    <Divider style={styles.dividerHSmall} />
                    <Pressable
                      onPress={() => setEmojiPickerOpen(true)}
                      style={goalModalStyles(theme).emojiButton}>
                      <Text variant="headlineMedium">
                        {goalEmojiInput.emoji}
                      </Text>
                    </Pressable>
                  </View>
                  <Divider style={styles.dividerSmall} />
                  <SegmentedButtons
                    value={goalVisibility}
                    onValueChange={setGoalVisibility}
                    buttons={[
                      {
                        value: 'public',
                        label: 'Shareable',
                        icon: 'earth-outline',
                      },
                      {
                        value: 'private',
                        label: 'Private',
                        icon: 'lock-closed-outline',
                      },
                    ]}
                  />
                  <Divider style={styles.dividerSmall} />
                  <Text variant="titleMedium">
                    Set a goal for completing this habit:
                  </Text>
                  <Divider style={styles.dividerTiny} />
                  <TextInput
                    style={modalStyles.textInput}
                    mode="outlined"
                    label="Target amount"
                    keyboardType="decimal-pad"
                    value={goalFreqAmtInput.toString()}
                    onChangeText={text => setGoalFreqAmtInput(text)}
                    right={
                      <TextInput.Affix
                        text={
                          pluralize(goalUnits, parseFloat(goalFreqAmtInput)) +
                          ' ' +
                          goalFreqInput
                        }
                      />
                    }
                  />
                  <Divider style={styles.dividerTiny} />
                  <View style={styles.row}>
                    <View style={{flex: 2}}>
                      <TextInput
                        dense
                        style={modalStyles.textInput}
                        mode="outlined"
                        label="Units"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={goalUnits}
                        onChangeText={text => setGoalUnits(text)}
                      />
                    </View>
                    <Divider style={styles.dividerHSmall} />
                    <View style={{flex: 3, paddingTop: 6}}>
                      <SegmentedButtons
                        value={goalFreqInput}
                        onValueChange={setGoalFreqInput}
                        buttons={[
                          {
                            value: 'daily',
                            label: 'Daily',
                          },
                          {
                            value: 'weekly',
                            label: 'Weekly',
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <Divider style={styles.dividerMedium} />
                  <Button
                    mode="contained"
                    onPress={() => {
                      addGoal(
                        uid,
                        goalNameInput,
                        '',
                        goalTypeInput,
                        goalFreqInput,
                        parseFloat(goalFreqAmtInput),
                        goalUnits,
                        goalVisibility,
                        goalEmojiInput.emoji,
                        dispatch,
                      );
                      setGoalNameInput('');
                      setGoalFreqAmtInput(0);
                      setGoalFreqInput('daily');
                      hideModal();
                    }}>
                    Make it happen
                  </Button>
                </Surface>
              </Pressable>
            </KeyboardAvoidingView>
          </Pressable>
        </Modal>
        <EmojiPicker
          onEmojiSelected={emoji => setGoalEmojiInput(emoji)}
          open={emojiPickerOpen}
          onClose={() => setEmojiPickerOpen(false)}
        />
      </Portal>
      <Animated.View style={surfaceAnimatedStyles}>
        <Pressable
          onPressIn={() => {
            setPressed(true);
            surfaceScale.value = withSpring(0.95, {
              damping: 10,
              stiffness: 200,
            });
          }}
          onPressOut={() => {
            setPressed(false);
            surfaceScale.value = withSpring(1, {
              damping: 10,
              stiffness: 200,
            });
          }}
          onPress={() => {
            showModal();
          }}>
          <BlurView
            blurType="dark"
            blurAmount={32}
            reducedTransparencyFallbackColor="white"
            style={{
              ...goalSurfaceStyles.surface,
              opacity: pressed ? 0.8 : 1.0,
            }}>
            <View style={goalSurfaceStyles.contentWrapper}>
              <Text style={goalSurfaceStyles.addGoal}>Add a new habit</Text>
              <Icon name="add-circle-outline" size={21} color={'#ecdce5'} />
            </View>
          </BlurView>
        </Pressable>
      </Animated.View>
    </>
  );
}

const goalModalStyles = theme =>
  StyleSheet.create({
    emojiButton: {
      backgroundColor: 'white',
      borderColor: theme.colors.outline,
      borderWidth: 1,
      height: 52,
      width: 52,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      marginTop: 6,
      paddingTop: 2,
      paddingLeft: 0.5,
    },
  });

const goalSurfaceStyles = StyleSheet.create({
  surface: {
    width: '100%',
    padding: 14,
    paddingVertical: 8,
    elevation: 0,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  addGoal: {
    fontSize: 18,
    color: '#ecdce5',
    flex: 1,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
