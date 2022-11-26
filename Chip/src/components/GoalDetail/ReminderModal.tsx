import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {useSelector, useDispatch} from 'react-redux';
import {selectUid} from '../redux/authSlice';

import {
  scheduleNotification,
  onDisplayNotification,
  onCreateTriggerNotification,
  requestNotificationsPermission,
} from '../reminders/reminders';

import {styles, modalStyles} from '../../styles';

function AddReminderScreen() {
  const [reminderFrequency, setReminderFrequency] = useState('one-time');
  const [reminderDate, setReminderDate] = useState(new Date());
  const [reminderTime, setReminderTime] = useState({
    hours: 12,
    minutes: 15,
  });

  // Modals
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const dateModalDismiss = () => {
    setDateModalVisible(false);
  };
  const dateModalConfirm = ({date}) => {
    setDateModalVisible(false);
    console.log(date);
  };

  const timeModalDismiss = () => {
    setTimeModalVisible(false);
  };
  const timeModalConfirm = ({hours, minutes}) => {
    setTimeModalVisible(false);
    setReminderTime({
      hours: hours,
      minutes: minutes,
    });
  };

  return (
    <View>
      <Portal>
        <DatePickerModal
          mode="single"
          visible={dateModalVisible}
          onDismiss={dateModalDismiss}
          date={reminderDate}
          onConfirm={dateModalConfirm}
          //   validRange={{
          //     startDate: new Date(2021, 1, 2),  // optional
          //     endDate: new Date(), // optional
          //     disabledDates: [new Date()] // optional
          //   }}
          // onChange={} // same props as onConfirm but triggered without confirmed by user
          // saveLabel="Save" // optional
          // saveLabelDisabled={true} // optional, default is false
          label="Select date" // optional
          // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
          startYear={2000} // optional, default is 1800
          endYear={2100} // optional, default is 2200
          closeIcon="close-outline"
          editIcon="pencil"
          calendarIcon="calendar"
        />
        <TimePickerModal
          visible={timeModalVisible}
          onDismiss={timeModalDismiss}
          onConfirm={timeModalConfirm}
          hours={reminderTime.hours}
          minutes={reminderTime.minutes}
          label="Select time" // optional, default 'Select time'
          cancelLabel="Cancel" // optional, default: 'Cancel'
          confirmLabel="Ok" // optional, default: 'Ok'
          keyboardIcon={() => <MDIcon name="keyboard" size={24} />}
          clockIcon="time-outline"
        />
      </Portal>
      <SegmentedButtons
        style={modalStyles.segmentedButtons}
        value={reminderFrequency}
        onValueChange={setReminderFrequency}
        buttons={[
          {
            value: 'one-time',
            label: 'One-time',
            style: {
              width: '33.3%',
            },
          },
          {
            value: 'daily',
            label: 'Daily',
            style: {
              width: '33.3%',
            },
          },
          {
            value: 'weekly',
            label: 'Weekly',
            style: {
              width: '33.3%',
            },
          },
        ]}
      />
      <View style={styles.row}>
        <Button onPress={() => setDateModalVisible(true)} mode="outlined">
          date
        </Button>
        <Button onPress={() => setTimeModalVisible(true)} mode="outlined">
          {reminderTime.hours} : {reminderTime.minutes}
        </Button>
      </View>
    </View>
  );
}

export default function RemindersModal({visible, hideModal}) {
  const [screen, setScreen] = useState('add');

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={modalStyles.container}>
      <Text style={modalStyles.header}>Reminders</Text>
      <SegmentedButtons
        value={screen}
        onValueChange={setScreen}
        buttons={[
          {
            value: 'add',
            label: 'Add',
            style: {
              width: '50%',
            },
          },
          {
            value: 'manage',
            label: 'Manage',
            style: {
              width: '50%',
            },
          },
        ]}
      />
      <Divider style={{marginVertical: 10}} />
      {screen === 'add' ? <AddReminderScreen /> : <View />}
    </Modal>
  );
}
