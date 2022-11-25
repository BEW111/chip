import React, {useState} from 'react';

import {Pressable, View, StyleSheet} from 'react-native';
import {
  Portal,
  Modal,
  Surface,
  Text,
  TextInput,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import {useSelector} from 'react-redux';
import {selectUid} from '../../redux/authSlice';

import {addGoal} from '../../firebase/goals';
import {styles, modalStyles} from '../../styles';

export default function AddGoalSurface() {
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  const [goalInput, setGoalInput] = useState('');

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
            value={goalInput}
            onChangeText={text => setGoalInput(text)}
          />
          <Button
            mode="contained"
            onPress={() => {
              addGoal(uid, goalInput);
              setGoalInput('');
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
          <View style={styles.centered}>
            <View style={goalSurfaceStyles.contentWrapper}>
              <Icon name="add-circle-outline" size={36} />
              <Text style={goalSurfaceStyles.addGoal}>Add a new goal</Text>
            </View>
          </View>
        </Surface>
      </Pressable>
    </>
  );
}

const goalSurfaceStyles = StyleSheet.create({
  surface: {
    width: '100%',
    padding: 12,
    elevation: 0,
    borderRadius: 10,
    backgroundColor: '#ffddf1',

    display: 'flex',
    alignItems: 'center',
  },
  addGoal: {
    fontSize: 32,
    marginLeft: 12,
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
