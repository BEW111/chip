import React, {useState} from 'react';

import {Pressable, View, StyleSheet} from 'react-native';
import {
  Portal,
  Modal,
  Surface,
  Text,
  TextInput,
  Button,
  SegmentedButtons,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import {useSelector} from 'react-redux';
import {selectUid} from '../../redux/authSlice';

import {addGoal} from '../../firebase/goals';
import {styles, modalStyles} from '../../styles';

export default function AddGoalSurface() {
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [goalNameInput, setGoalNameInput] = useState('');
  const [goalTypeInput, setGoalTypeInput] = useState('');

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

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
          {/* <SegmentedButtons
            value={goalTypeInput}
            onValueChange={setGoalTypeInput}
            buttons={[
              {
                value: 'form',
                label: 'Form',
              },
              {
                value: 'break',
                label: 'Break',
              },
            ]}
            // style={styles.group}
          /> */}
          <Button
            mode="contained"
            onPress={() => {
              addGoal(uid, goalNameInput, '', 'form');
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
        <Surface
          style={{...goalSurfaceStyles.surface, opacity: pressed ? 0.8 : 1.0}}>
          <View style={goalSurfaceStyles.contentWrapper}>
            <Text style={goalSurfaceStyles.addGoal}>Add a new goal</Text>
            <Icon name="add-circle-outline" size={21} color={'#ffddf1'} />
          </View>
        </Surface>
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

    backgroundColor: '#222222',

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
