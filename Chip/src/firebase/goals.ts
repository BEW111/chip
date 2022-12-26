import firestore from '@react-native-firebase/firestore';

import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

import {Goal} from '../types';
import {
  updateUserGoals,
  updateUserGoalName,
  deleteUserGoal,
  addUserGoal,
} from '../redux/authSlice';
import {Dispatch} from '@reduxjs/toolkit';

// Gets all goals for a particular user
export async function getGoals(UID: string) {
  console.log('Retrieving goals');
  const snapshot = await firestore()
    .collection('users')
    .doc(UID)
    .collection('goals')
    .get();

  return snapshot.docs.map(doc => doc.data());
}

// Creates a new goal to add for this user
// generates a random unique ID, and returns it
export async function addGoal(
  UID: string,
  goalName: string,
  goalDesc: string,
  goalType: '' | 'form' | 'break' | 'do' | undefined,
  goalFreq: '' | 'daily' | 'weekly' | undefined,
  goalFreqAmt: number,
  dispatch: Dispatch,
) {
  console.log('Adding new goal');
  const currentdt = firestore.Timestamp.fromDate(new Date());
  const goalId = uuidv4();

  const goal: Goal = {
    id: goalId,
    name: goalName,
    timeCreated: currentdt,
    description: goalDesc,
    type: goalType,
    streak: 0,
    frequency: goalFreq,
    frequencyAmount: goalFreqAmt,
  };

  await firestore()
    .collection('users')
    .doc(UID)
    .collection('goals')
    .doc(goalId)
    .set(goal);

  console.log('Goal added!');

  dispatch(
    addUserGoal({
      goalId: goalId,
      goalName: goalName,
    }),
  );

  return goalId;
}

// Edits the name of an existing goal, given its ID
// TODO: update local state
export async function editGoalName(
  UID: string,
  goalId: string,
  newName: string,
  dispatch: Dispatch,
) {
  console.log('Editing goal name');
  await firestore()
    .collection('users')
    .doc(UID)
    .collection('goals')
    .doc(goalId)
    .update({
      name: newName,
    });

  dispatch(
    updateUserGoalName({
      goalId: goalId,
      newName: newName,
    }),
  );

  return goalId;
}

// Removes a goal for a user (currently doesn't remove chips)
// TODO: update local state
export async function deleteGoal(
  UID: string,
  goalId: string,
  dispatch: Dispatch,
) {
  console.log('Deleting goal');

  const result = await firestore()
    .collection('users')
    .doc(UID)
    .collection('goals')
    .doc(goalId)
    .delete();

  dispatch(
    deleteUserGoal({
      goalId: goalId,
    }),
  );

  return result;
}

// Updates the local state for user goals
// TODO: rename to "dispatchRefreshUserGoals"
export async function dispatchRefreshUserGoals(
  UID: string,
  dispatch: Dispatch,
) {
  try {
    const goals = await getGoals(UID); // retrive user data from firestore
    dispatch(
      updateUserGoals(
        goals.map(g => ({
          id: g.id,
          name: g.name,
        })),
      ),
    );
  } catch (error) {
    console.log(error);
  }
}
