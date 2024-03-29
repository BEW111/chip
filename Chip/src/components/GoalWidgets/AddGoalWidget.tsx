import React, {useState, useEffect} from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';

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
  HelperText,
  Checkbox,
} from 'react-native-paper';
import EmojiPicker from 'rn-emoji-keyboard';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import Tooltip from '../common/Tooltip';
import pluralize from 'pluralize';

// Navigation
import {useNavigation} from '@react-navigation/native';

// Animations
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

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
import {selectUid} from '../../redux/slices/authSlice';
import {
  useGetGoalsQuery,
  useAddGoalMutation,
} from '../../redux/slices/goalsSlice';
import {
  selectTutorialStage,
  updateTutorialStage,
} from '../../redux/slices/tutorialSlice';
import CheckboxAndroid from 'react-native-paper/lib/typescript/src/components/Checkbox/CheckboxAndroid';

function TextDisabled({children, disabled, variant}) {
  return (
    <Text
      variant={variant}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        color: disabled ? 'gray' : 'black',
      }}>
      {children}
    </Text>
  );
}

export default function AddGoalWidget() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  // Tutorial stage state
  const tutorialStage = useAppSelector(selectTutorialStage);

  // Input state changes
  const onGoalNameEndEditing = () => {
    if (tutorialStage === 'goals-entering-name' && goalNameInput !== '') {
      dispatch(updateTutorialStage('goals-entering-privacy'));
    }
  };
  const onGoalVisibilityChange = (value: GoalVisibility) => {
    if (tutorialStage === 'goals-entering-privacy') {
      dispatch(updateTutorialStage('goals-entering-units'));
    }
    setGoalVisibility(value);
  };
  const onToggleCustomUnits = () => {
    if (tutorialStage === 'goals-entering-units') {
      dispatch(updateTutorialStage('goals-entering-schedule'));
    }
    setGoalCustomUnitsEnabled(!goalCustomUnitsEnabled);
  };
  const onTargetEndEditing = () => {
    if (tutorialStage === 'goals-entering-schedule') {
      dispatch(updateTutorialStage('goals-entering-done'));
    }
  };
  const onFreqChange = (value: GoalIterationPeriod) => {
    if (tutorialStage === 'goals-entering-schedule') {
      dispatch(updateTutorialStage('goals-entering-done'));
    }
    setGoalFreqInput(value);
  };
  const toggleOnDay = (day: Dow) => {
    if (tutorialStage === 'goals-entering-schedule') {
      dispatch(updateTutorialStage('goals-entering-done'));
    }

    setGoalOnDaysInput({...goalOnDaysInput, [day]: !goalOnDaysInput[day]});
  };

  // Animations
  const [pressed, setPressed] = useState(false);
  const surfaceScale = useSharedValue(1);
  const surfaceAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: surfaceScale.value}],
    };
  });

  // Current state modal state
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => {
    if (tutorialStage === 'goals-wait-start-create') {
      dispatch(updateTutorialStage('goals-entering-name'));
    }
    setModalVisible(true);
  };
  const hideModal = () => {
    setGoalFreqInput('daily');
    setGoalOnDaysInput(defaultGoalDays);
    setModalVisible(false);
  };

  // Error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inputs
  const [goalNameInput, setGoalNameInput] = useState('');
  const [goalEmojiInput, setGoalEmojiInput] = useState({
    emoji: '💪',
  });
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const [goalTypeInput, setGoalTypeInput] = useState<GoalType>('build');
  const [goalFreqInput, setGoalFreqInput] =
    useState<GoalIterationPeriod>('daily');
  const [goalTargetInput, setGoalTargetInput] = useState(1);
  const [goalUnits, setGoalUnits] = useState('minutes');
  const [goalCustomUnitsEnabled, setGoalCustomUnitsEnabled] = useState(false);
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

  // Get current user
  const uid = useAppSelector(selectUid);

  // Will need this to update the goals locally
  const [addGoal] = useAddGoalMutation();
  const {refetch: refetchGoals} = useGetGoalsQuery();

  // Animation for tutorial
  useEffect(() => {
    if (tutorialStage === 'goals-wait-start-create') {
      surfaceScale.value = withRepeat(
        withTiming(1.05, {
          duration: 1000,
          easing: Easing.out(Easing.exp),
        }),
        -1,
        true,
      );
    }
    // It wants us to add surfaceScale here, but doing so breaks it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialStage]);

  // Called when we try to create the goal
  const onCreateGoal = async () => {
    if (goalNameInput === '') {
      setErrorMessage('You must enter a valid goal name.');
      return;
    }

    // Validating weekdays
    let dowBitField = 0;
    if (goalFreqInput === 'weekly') {
      dowBitField = allDays;
    } else {
      dowBitField = weekdaysObjectToBitField(goalOnDaysInput);
      if (dowBitField === 0) {
        setErrorMessage('You must select at least one weekday.');
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
        iteration_units: goalCustomUnitsEnabled ? goalUnits : 'completion',
        iteration_dows: dowBitField,
      };

      await addGoal(goal);

      // May be able to remove this now that addGoal is in our api slice
      refetchGoals();

      // Hide and reset
      hideModal();

      // Reset all modal state
      setGoalNameInput('');
      setGoalEmojiInput({
        emoji: '💪',
      });
      setGoalVisibility('private');
      setGoalTypeInput('build');
      setGoalUnits('minute');
      setGoalCustomUnitsEnabled(false);
      setGoalTargetInput(1);
      setGoalFreqInput('daily');
      setGoalOnDaysInput(defaultGoalDays);

      // Update tutorial if necessary
      if (tutorialStage?.startsWith('goals')) {
        dispatch(updateTutorialStage('track-wait-take-photo-transition'));
        navigation.navigate('Track');
      }
    } else {
      setErrorMessage('Sorry, something went wrong.');
    }
  };

  // Called when we tap on the background of the surface
  const onMainSurfacePressed = () => {
    Keyboard.dismiss();
    if (tutorialStage === 'goals-entering-privacy') {
      dispatch(updateTutorialStage('goals-entering-units'));
    } else if (tutorialStage === 'goals-entering-units') {
      dispatch(updateTutorialStage('goals-entering-schedule'));
    }
  };

  return (
    <>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal}>
          <Pressable pointerEvents="auto" onPress={hideModal}>
            <KeyboardAvoidingView>
              <Pressable onPress={onMainSurfacePressed}>
                <Surface style={modalStyles.container}>
                  <Text style={modalStyles.header}>Create a new goal</Text>
                  <View style={styles.row}>
                    <View style={styles.expand}>
                      <Tooltip
                        visible={tutorialStage === 'goals-entering-name'}
                        text="Pick an easy goal you can do right now.">
                        <TextInput
                          style={modalStyles.textInput}
                          mode="outlined"
                          label="Goal name"
                          value={goalNameInput}
                          onChangeText={setGoalNameInput}
                          onEndEditing={onGoalNameEndEditing}
                          autoCorrect={false}
                          maxLength={50}
                        />
                      </Tooltip>
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
                  <Tooltip
                    visible={tutorialStage === 'goals-entering-privacy'}
                    text={
                      'Do you want friends to see your goal? If you choose "shareable", your chips (photos) will automatically be posted to your story when you record them.'
                    }>
                    <SegmentedButtons
                      value={goalVisibility}
                      onValueChange={onGoalVisibilityChange}
                      buttons={[
                        {
                          value: 'public',
                          label: 'Shareable',
                          icon: 'earth-outline',
                          disabled: tutorialStage === 'goals-entering-name',
                        },
                        {
                          value: 'private',
                          label: 'Private',
                          icon: 'lock-closed-outline',
                          disabled: tutorialStage === 'goals-entering-name',
                        },
                      ]}
                    />
                  </Tooltip>
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
                  <TextDisabled
                    variant="titleMedium"
                    disabled={
                      tutorialStage === 'goals-entering-name' ||
                      tutorialStage === 'goals-entering-privacy'
                    }>
                    How will you measure your progress?
                  </TextDisabled>
                  <Tooltip
                    visible={tutorialStage === 'goals-entering-units'}
                    text={
                      'By default, you\'ll simply track how many times you completed the goal itself. But if you like, you can track something else like minutes, reps, or tasks. For example, you could write "minutes" to mean "minutes spent reading".'
                    }>
                    <View style={styles.row}>
                      <Checkbox.Android
                        disabled={
                          tutorialStage === 'goals-entering-name' ||
                          tutorialStage === 'goals-entering-privacy'
                        }
                        status={
                          goalCustomUnitsEnabled ? 'checked' : 'unchecked'
                        }
                        onPress={onToggleCustomUnits}
                      />
                      <Text
                        disabled={
                          tutorialStage === 'goals-entering-name' ||
                          tutorialStage === 'goals-entering-privacy'
                        }
                        variant="labelMedium">
                        Track progress with custom units
                      </Text>
                    </View>
                  </Tooltip>
                  {goalCustomUnitsEnabled ? (
                    <TextInput
                      dense
                      style={modalStyles.textInput}
                      mode="outlined"
                      label="Custom units, e.g. minutes, reps, ..."
                      keyboardType="default"
                      autoCapitalize="none"
                      value={goalUnits}
                      onChangeText={text => setGoalUnits(text)}
                      disabled={
                        tutorialStage === 'goals-entering-name' ||
                        tutorialStage === 'goals-entering-privacy'
                      }
                      maxLength={50}
                    />
                  ) : (
                    <HelperText type="info">
                      You'll track your progress simply by how many times you've
                      completed this goal.
                    </HelperText>
                  )}

                  <Divider style={styles.dividerSmall} />
                  <TextDisabled
                    variant="titleMedium"
                    disabled={
                      tutorialStage === 'goals-entering-name' ||
                      tutorialStage === 'goals-entering-privacy' ||
                      tutorialStage === 'goals-entering-units'
                    }>
                    Set a target to complete regularly:
                  </TextDisabled>
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
                              (goalCustomUnitsEnabled
                                ? pluralize(
                                    goalUnits,
                                    parseFloat(goalTargetInput),
                                  ) + ' '
                                : '') + goalFreqInput
                            }
                          />
                        }
                        onEndEditing={onTargetEndEditing}
                        disabled={
                          tutorialStage === 'goals-entering-name' ||
                          tutorialStage === 'goals-entering-privacy' ||
                          tutorialStage === 'goals-entering-units'
                        }
                        maxLength={10}
                      />
                    </View>
                  </View>
                  <Divider style={styles.dividerSmall} />
                  <SegmentedButtons
                    value={goalFreqInput}
                    onValueChange={onFreqChange}
                    buttons={[
                      {
                        value: 'daily',
                        label: 'Daily',
                        disabled:
                          tutorialStage === 'goals-entering-name' ||
                          tutorialStage === 'goals-entering-privacy' ||
                          tutorialStage === 'goals-entering-units',
                      },
                      {
                        value: 'weekly',
                        label: 'Weekly',
                        disabled:
                          tutorialStage === 'goals-entering-name' ||
                          tutorialStage === 'goals-entering-privacy' ||
                          tutorialStage === 'goals-entering-units',
                      },
                    ]}
                  />
                  <Divider style={styles.dividerSmall} />
                  <Tooltip
                    visible={tutorialStage === 'goals-entering-schedule'}
                    text={'Pick a realistic target to complete regularly.'}>
                    <View style={styles.rowCenteredSpaceBetween}>
                      {dows.map((day: Dow) => (
                        <IconButton
                          key={day}
                          mode="contained-tonal"
                          disabled={
                            goalFreqInput === 'weekly' ||
                            tutorialStage === 'goals-entering-name' ||
                            tutorialStage === 'goals-entering-privacy' ||
                            tutorialStage === 'goals-entering-units'
                          }
                          icon={({color: color}) => (
                            <Text style={{color: color}}>
                              {day.slice(0, 3)}
                            </Text>
                          )}
                          selected={goalOnDaysInput[day]}
                          onPress={() => toggleOnDay(day)}
                          style={goalModalStyles(theme, false).dayIcon}
                        />
                      ))}
                    </View>
                  </Tooltip>
                  <Divider style={styles.dividerMedium} />
                  {/* "Make it happen" create goal button */}
                  <HelperText type="error" visible={errorMessage !== null}>
                    {errorMessage}
                  </HelperText>
                  <Button
                    mode="contained"
                    onPress={onCreateGoal}
                    disabled={goalNameInput === ''}>
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
      {/* Actual widget button */}
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
