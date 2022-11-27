import firestore from '@react-native-firebase/firestore';

import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {Reminder} from '../types';

// Creates a new goal to add for this user
// generates a random unique ID, and returns it
export async function addReminderFirebase(
  UID: string,
  goalId: string,
  intent: 'none' | 'remind' | 'prepare' | 'now',
  scheduledTime: Date,
) {
  const currentdt = firestore.Timestamp.fromDate(new Date());
  const reminderId = uuidv4();

  const reminder: Reminder = {
    id: reminderId,
    goalId: goalId,
    timeCreated: currentdt,
    timeSent: firestore.Timestamp.fromDate(scheduledTime),
    notificationIntent: intent,
  };

  await firestore()
    .collection('users')
    .doc(UID)
    .collection('reminders')
    .doc(reminderId)
    .set(reminder);

  return goalId;
}
