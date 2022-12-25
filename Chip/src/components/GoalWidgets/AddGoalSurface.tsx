import React, {useState} from 'react';

import {
  Pressable,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {useSelector, useDispatch} from 'react-redux';
import {selectUid} from '../../redux/authSlice';

import {addGoal} from '../../firebase/goals';
import {modalStyles, styles} from '../../styles';

export default function AddGoalSurface() {
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const surfaceScale = useSharedValue(1);
  const surfaceAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: surfaceScale.value}],
    };
  });

  const [goalNameInput, setGoalNameInput] = useState('');
  const [goalTypeInput, setGoalTypeInput] = useState('daily');
  const [goalFreqInput, setGoalFreqInput] = useState('');
  const [goalFreqAmtInput, setGoalFreqAmtInput] = useState(0);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const dispatch = useDispatch();

  const uid = useSelector(selectUid);

  return (
    <>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={modalStyles.wrapper}>
          <Surface style={modalStyles.container}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              alwaysBounceVertical={false}
              keyboardShouldPersistTaps="handled">
              <Text style={modalStyles.header}>Add a new habit</Text>
              <Text variant="titleMedium">
                Name your habit, e.g. eat healthier:
              </Text>
              <Divider style={styles.dividerTiny} />
              <TextInput
                style={modalStyles.textInput}
                mode="outlined"
                label="Habit name"
                value={goalNameInput}
                onChangeText={text => setGoalNameInput(text)}
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
                value={goalFreqAmtInput}
                onChangeText={text => setGoalFreqAmtInput(text)}
                right={<TextInput.Affix text={'minutes ' + goalFreqInput} />}
              />
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
              <Button
                mode="contained"
                onPress={() => {
                  addGoal(uid, goalNameInput, '', goalTypeInput, dispatch);
                  setGoalNameInput('');
                  hideModal();
                }}>
                Make it happen
              </Button>
            </ScrollView>
          </Surface>
        </Modal>
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

const goalSurfaceStyles = StyleSheet.create({
  surface: {
    width: '100%',
    padding: 14,
    paddingVertical: 8,
    elevation: 0,
    borderRadius: 10,

    // backgroundColor: '#222222',

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
