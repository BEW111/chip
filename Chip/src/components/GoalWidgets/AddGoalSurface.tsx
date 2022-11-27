import React, {useState} from 'react';

import {Pressable, View, StyleSheet} from 'react-native';
import {
  Portal,
  Modal,
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';

import {useSelector, useDispatch} from 'react-redux';
import {selectUid} from '../../redux/authSlice';

import {addGoal} from '../../firebase/goals';
import {modalStyles, styles} from '../../styles';

export default function AddGoalSurface() {
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [goalNameInput, setGoalNameInput] = useState('');
  const [goalTypeInput, setGoalTypeInput] = useState('');

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
          contentContainerStyle={modalStyles.container}>
          <Text style={modalStyles.header}>Add a new goal</Text>
          <TextInput
            style={modalStyles.textInput}
            label="Name of goal"
            value={goalNameInput}
            onChangeText={text => setGoalNameInput(text)}
          />
          <SegmentedButtons
            style={modalStyles.segmentedButtons}
            value={goalTypeInput}
            onValueChange={setGoalTypeInput}
            buttons={[
              {
                value: 'form',
                label: 'Form habit',
                icon: 'flask-outline',
                style: {
                  width: '50%',
                },
              },
              {
                value: 'break',
                label: 'Break habit',
                icon: 'build-outline',
                style: {
                  width: '50%',
                },
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
        </Modal>
      </Portal>
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={() => {
          showModal();
        }}>
        <BlurView
          blurType="dark"
          blurAmount={32}
          reducedTransparencyFallbackColor="white"
          style={{...goalSurfaceStyles.surface, opacity: pressed ? 0.8 : 1.0}}>
          <View style={goalSurfaceStyles.contentWrapper}>
            <Text style={goalSurfaceStyles.addGoal}>Add a new goal</Text>
            <Icon name="add-circle-outline" size={21} color={'#ffddf1'} />
          </View>
        </BlurView>
      </Pressable>
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
    color: '#ffddf1',
    flex: 1,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
