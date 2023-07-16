import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Button,
  Divider,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import {DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import {useSelector} from 'react-redux';
import {selectUid} from '../../redux/slices/authSlice';

import {
  requestNotificationsPermission,
  scheduleNotification,
  //   onDisplayNotification,
  //   onCreateTriggerNotification,
  //   requestNotificationsPermission,
} from '../../notifications/reminders';

import {styles, modalStyles} from '../../styles';
import {datePlainFormat, timePlainFormat} from '../../utils/utils';
import {addReminderFirebase} from '../../firebase/reminders';

function AddReminderScreen({hideModal, goalName, goalId}) {
  const uid = useSelector(selectUid);

  const now = new Date();

  // Reminder data
  const [reminderFrequency, setReminderFrequency] = useState<
    'one-time' | 'daily' | 'weekly'
  >('one-time');
  const [reminderDate, setReminderDate] = useState<Date>(now);
  const [reminderTime, setReminderTime] = useState({
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });
  const [reminderIntent, setReminderIntent] = useState<
    'none' | 'remind' | 'prepare' | 'now'
  >('remind');

  // Modals
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const dateModalDismiss = () => {
    setDateModalVisible(false);
  };
  const dateModalConfirm = ({date}) => {
    setDateModalVisible(false);
    setReminderDate(date);
  };
  const dateModalUpdate = ({date}) => {
    setReminderDate(date);
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

  const onCreateReminder = async () => {
    let reminderDatetime = reminderDate;

    reminderDatetime.setHours(reminderTime.hours);
    reminderDatetime.setMinutes(reminderTime.minutes);
    reminderDatetime.setSeconds(0);

    await requestNotificationsPermission();
    await scheduleNotification(
      reminderDatetime,
      `Reminder: ${goalName}`,
      reminderIntent,
    );
    await addReminderFirebase(uid, goalId, reminderIntent, reminderDatetime);

    hideModal();
  };

  return (
    <View>
      <Portal>
        <DatePickerModal
          locale="en"
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
          onChange={dateModalUpdate}
          saveLabel="Save" // optional
          saveLabelDisabled={false} // optional, default is false
          label="Select date" // optional
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
      <View style={styles.row}>
        {/* <Icon name="time-outline" size={28} /> */}
        <View>
          <Button
            uppercase={false}
            labelStyle={modalStyles.textButtonLabel}
            contentStyle={styles.justifyLeft}
            onPress={() => setDateModalVisible(true)}
            mode="text">
            {datePlainFormat(reminderDate)}
          </Button>
          <Button
            uppercase={false}
            labelStyle={modalStyles.textButtonLabel}
            contentStyle={styles.justifyLeft}
            onPress={() => setTimeModalVisible(true)}
            mode="text">
            {timePlainFormat(reminderTime)}
          </Button>
        </View>
      </View>
      <Divider style={styles.dividerSmall} />
      <Text>Reminder frequency</Text>
      <Divider style={styles.dividerTiny} />
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
      <Divider style={styles.dividerSmall} />
      <Text>Reminder type</Text>
      <Divider style={styles.dividerTiny} />
      <SegmentedButtons
        style={modalStyles.segmentedButtons}
        value={reminderIntent}
        onValueChange={setReminderIntent}
        buttons={[
          {
            value: 'now',
            label: 'Do now',
            style: {
              width: '33.3%',
            },
          },
          {
            value: 'prepare',
            label: 'Prep ahead',
            style: {
              width: '33.3%',
            },
          },
          // {
          //   value: 'remind',
          //   label: 'Motivational',
          //   style: {
          //     width: '33.3%',
          //   },
          // },
        ]}
      />
      <Divider style={styles.dividerMedium} />
      <Button mode="contained" onPress={onCreateReminder}>
        Create reminder
      </Button>
    </View>
  );
}

export default function RemindersModal({visible, hideModal, goalName, goalId}) {
  const [screen, setScreen] = useState('add');

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={modalStyles.container}>
      <Text style={modalStyles.header}>Your reminders</Text>
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
            icon: 'add-circle-outline',
          },
          {
            value: 'manage',
            label: 'Manage',
            style: {
              width: '50%',
            },
            icon: 'hammer-outline',
          },
        ]}
      />
      <Divider style={{marginVertical: 10}} />
      {screen === 'add' ? (
        <AddReminderScreen
          hideModal={hideModal}
          goalName={goalName}
          goalId={goalId}
        />
      ) : (
        <View />
      )}
    </Modal>
  );
}
