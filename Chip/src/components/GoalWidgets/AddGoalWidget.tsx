import React, {useState, useEffect} from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';

// Components
import {
  Portal,
  Modal,
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Divider,
  Surface,
  useTheme,
  IconButton,
} from 'react-native-paper';
import EmojiPicker from 'rn-emoji-keyboard';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import pluralize from 'pluralize';

// Animations
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {useAppSelector} from '../../redux/hooks';
import {selectNewlyCreated, selectUid} from '../../redux/slices/authSlice';

// Database interactions
import {modalStyles, styles} from '../../styles';
import {
  GoalIterationPeriod,
  GoalType,
  GoalVisibility,
  SupabaseGoalUpload,
} from '../../types/goals';
import {
  Dow,
  DowObject,
  allDays,
  dows,
  weekdaysObjectToBitField,
} from '../../utils/dow';

// Updating local state
import {useGetGoalsQuery, useAddGoalMutation} from '../../redux/supabaseApi';

export default function AddGoalWidget() {
  const theme = useTheme();

  // Animations
  const [pressed, setPressed] = useState(false);
  const surfaceScale = useSharedValue(1);
  const surfaceAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: surfaceScale.value}],
    };
  });

  // Current state
  const [modalVisible, setModalVisible] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  // Inputs
  const [goalNameInput, setGoalNameInput] = useState('');
  const [goalEmojiInput, setGoalEmojiInput] = useState({
    emoji: '💪',
  });
  const [goalTypeInput, setGoalTypeInput] = useState<GoalType>('build');
  const [goalFreqInput, setGoalFreqInput] =
    useState<GoalIterationPeriod>('daily');
  const [goalTargetInput, setGoalTargetInput] = useState(1);
  const [goalUnits, setGoalUnits] = useState('minute');
  const [goalVisibility, setGoalVisibility] =
    useState<GoalVisibility>('private');

  // Goal days input
  const defaultGoalDays: DowObject = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  };
  const [goalOnDaysInput, setGoalOnDaysInput] =
    useState<DowObject>(defaultGoalDays);

  // Editing the goal "on days"
  const toggleOnDay = (day: Dow) => {
    setGoalOnDaysInput({...goalOnDaysInput, [day]: !goalOnDaysInput[day]});
  };

  // Get current user
  const uid = useAppSelector(selectUid);
  const isNewUser = useAppSelector(selectNewlyCreated);

  // Will need this to update the goals locally
  const [addGoal] = useAddGoalMutation();
  const {refetch: refetchGoals} = useGetGoalsQuery();

  // Animation for tutorial
  useEffect(() => {
    if (isNewUser) {
      surfaceScale.value = withRepeat(
        withTiming(1.05, {
          duration: 1000,
          easing: Easing.out(Easing.exp),
        }),
        -1,
        true,
      );
    }
  }, []);

  // Called when we try to create the goal
  const onCreateGoal = async () => {
    // TODO: need error messages
    if (goalNameInput === '') {
      return;
    }

    let dowBitField = 0;
    if (goalFreqInput === 'weekly') {
      dowBitField = allDays;
    } else {
      dowBitField = weekdaysObjectToBitField(goalOnDaysInput);
      if (dowBitField === 0) {
        return;
      }
    }

    if (uid) {
      const goal: SupabaseGoalUpload = {
        uid: uid,
        name: goalNameInput,

        description: '',
        type: goalTypeInput,
        is_public: goalVisibility === 'public',
        emoji: goalEmojiInput.emoji,

        iteration_period: goalFreqInput,
        iteration_target: goalTargetInput,
        iteration_units: goalUnits,
        iteration_dows: dowBitField,
      };

      await addGoal(goal);

      // We'll also need to update the local cache
      refetchGoals();
    }

    hideModal();
    setGoalNameInput('');
    setGoalTargetInput(0);
    setGoalFreqInput('daily');
  };

  return (
    <>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal}>
          <Pressable pointerEvents="auto" onPress={hideModal}>
            <KeyboardAvoidingView>
              <Pressable onPress={Keyboard.dismiss}>
                <Surface style={modalStyles.container}>
                  <Text style={modalStyles.header}>Create a new goal</Text>
                  <View style={styles.row}>
                    <View style={styles.expand}>
                      <TextInput
                        style={modalStyles.textInput}
                        mode="outlined"
                        label="Goal name"
                        value={goalNameInput}
                        onChangeText={setGoalNameInput}
                        autoCorrect={false}
                      />
                    </View>
                    <Divider style={styles.dividerHSmall} />
                    <Pressable
                      onPress={() => setEmojiPickerOpen(true)}
                      style={
                        goalModalStyles(theme, emojiPickerOpen).emojiButton
                      }>
                      <Text variant="headlineMedium">
                        {goalEmojiInput.emoji}
                      </Text>
                      <Icon
                        style={
                          goalModalStyles(theme, emojiPickerOpen).emojiIcon
                        }
                        name={'pencil-outline'}
                        size={24}
                      />
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
                  {/* <Divider style={styles.dividerSmall} />
                  <Text variant="titleMedium">
                    Will you build up a goal or break a habit?
                  </Text>
                  <Divider style={styles.dividerTiny} />
                  <SegmentedButtons
                    value={goalTypeInput}
                    onValueChange={setGoalTypeInput}
                    buttons={[
                      {
                        value: 'build',
                        label: 'Build',
                      },
                      {
                        value: 'break',
                        label: 'Break',
                      },
                    ]}
                  /> */}
                  <Divider style={styles.dividerSmall} />
                  <Text variant="titleMedium">
                    How will you measure your progress?
                  </Text>
                  <TextInput
                    dense
                    style={modalStyles.textInput}
                    mode="outlined"
                    label="Units, e.g. minutes, reps, ..."
                    keyboardType="default"
                    autoCapitalize="none"
                    value={goalUnits}
                    onChangeText={text => setGoalUnits(text)}
                  />
                  <Divider style={styles.dividerSmall} />
                  <Text variant="titleMedium">
                    Set a target to complete regularly:
                  </Text>
                  <View style={styles.row}>
                    <View style={{flex: 3}}>
                      <TextInput
                        dense
                        style={modalStyles.textInput}
                        mode="outlined"
                        label="Target amount"
                        keyboardType="decimal-pad"
                        value={goalTargetInput.toString()}
                        onChangeText={text => setGoalTargetInput(text)}
                        right={
                          <TextInput.Affix
                            text={
                              pluralize(
                                goalUnits,
                                parseFloat(goalTargetInput),
                              ) +
                              ' ' +
                              goalFreqInput
                            }
                          />
                        }
                      />
                    </View>
                  </View>
                  <Divider style={styles.dividerSmall} />
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
                  <Divider style={styles.dividerSmall} />
                  <View style={styles.rowCenteredSpaceBetween}>
                    {dows.map((day: Dow) => (
                      <IconButton
                        mode="contained-tonal"
                        disabled={goalFreqInput === 'weekly'}
                        icon={({color: color}) => (
                          <Text style={{color: color}}>{day.slice(0, 3)}</Text>
                        )}
                        selected={goalOnDaysInput[day]}
                        onPress={() => toggleOnDay(day)}
                        style={goalModalStyles(theme, false).dayIcon}
                      />
                    ))}
                  </View>
                  <Divider style={styles.dividerLarge} />
                  <Button mode="contained" onPress={onCreateGoal}>
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
              <Text style={goalSurfaceStyles.addGoal}>Create a new goal</Text>
              <Icon name="add-circle-outline" size={21} color={'#ecdce5'} />
            </View>
          </BlurView>
        </Pressable>
      </Animated.View>
    </>
  );
}

const goalModalStyles = (theme, selected) =>
  StyleSheet.create({
    emojiButton: {
      backgroundColor: 'white',
      borderColor: selected ? theme.colors.primary : theme.colors.outline,
      height: 52,
      width: 52,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      marginTop: 6,
      paddingTop: 2,
      paddingLeft: 0.5,
      borderWidth: selected ? 2 : 1,
    },
    emojiIcon: {
      position: 'absolute',
      color: theme.colors.outline,
      paddingLeft: 2,
      paddingBottom: 2,
      opacity: selected ? 0.3 : 0.6,
    },
    dayIcon: {
      margin: 0,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
  });

const goalSurfaceStyles = StyleSheet.create({
  surface: {
    width: '100%',
    padding: 14,
    paddingVertical: 8,
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
