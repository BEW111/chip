/**
 * Goals, streaks, etc.
 */

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

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
  goalIterationPeriod: '' | 'daily' | 'weekly',
  goalIterationAmount: number,
  dispatch: Dispatch,
) {
  console.log('Adding new goal');
  const goalId = uuidv4();

  let now = new Date();
  const currentdt = firestore.Timestamp.fromDate(now);

  now.setUTCHours(0, 0, 0, 0);
  const startOfToday = firestore.Timestamp.fromDate(now);

  const goal: Goal = {
    id: goalId,
    name: goalName,
    timeCreated: currentdt,
    description: goalDesc,
    type: goalType,
    streak: 0,
    streakMet: false,
    iterationPeriod: goalIterationPeriod,
    iterationAmount: goalIterationAmount,
    currentIterationProgress: 0,
    currentIterationStart: startOfToday,
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

    console.log(goals);
    dispatch(
      updateUserGoals(
        goals.map(g => ({
          id: g.id,
          name: g.name,
          streak: g.streak,
        })),
      ),
    );
  } catch (error) {
    console.log(error);
  }
}

// 1. Add to current streak progress
// 2. Check streakMet
// 3. If current streak progress is more than iteration amount, set streakMet to 1 and increment streak
export async function updateAndCheckStreakIncremented(
  UID: string,
  goalID: string,
  incrementAmount: number,
) {
  console.log('Checking if streak should be incremented');
  const goalDoc = await firestore()
    .collection('users')
    .doc(UID)
    .collection('goals')
    .doc(goalID);

  let snapshot = await goalDoc.get();

  const goalData = snapshot.data();

  if (!goalData) {
    return {
      status: 'error',
      message: 'Error when retrieving goal data',
    };
  }

  if (goalData.streakMet) {
    console.log('Streak already met this iteration');
    return {
      status: 'success',
    };
  }

  console.log(goalData);

  if (
    goalData.currentIterationProgress + incrementAmount >=
    goalData.iterationAmount
  ) {
    const result = await goalDoc.update({
      streakMet: 1,
      streak: firestore.FieldValue.increment(1),
      currentIterationProgress: firestore.FieldValue.increment(incrementAmount),
    });

    console.log('Streak incremented');

    return result;
  } else {
    const result = await goalDoc.update({
      currentIterationProgress: firestore.FieldValue.increment(incrementAmount),
    });

    console.log('Not incrementing streak');
    return result;
  }
}

// Needs to be checked when app is opened (and technically at the beginning of every day)
// Assumes goal data has already been retrieved
// 1. Check if current datetime - currentIteration start is more than iterationPeriod
// 2. If so, set streakMet to 0, currentIterationAmount to 0, and check if streakMet
// 3. If so, increment currentIterationStart by iterationPeriod
// 4. Otherwise, set streak to 0, and set currentIterationStart to beginning of day today
export async function checkStreakReset(
  UID: string,
  goalId: string,
  externalGoalData: FirebaseFirestoreTypes.DocumentData | undefined = undefined,
) {
  const goalDoc = await firestore()
    .collection('users')
    .doc(UID)
    .collection('goals')
    .doc(goalId);

  let goalData = externalGoalData;

  if (!externalGoalData) {
    const goalSnapshot = await goalDoc.get();
    goalData = goalSnapshot.data();
  }

  if (!goalData) {
    return {
      status: 'error',
      message: 'Error when retrieving goal data',
    };
  }

  const today = new Date();
  const durationTimeMap = {
    daily: 1,
    weekly: 7,
    '': 0,
  };

  const nextIterationStart: Date = goalData.currentIterationStart.toDate();
  nextIterationStart.setDate(
    nextIterationStart.getDate() + durationTimeMap[goalData.iterationPeriod],
  );

  // If true, then we're past the iteration period and the streak should be reset
  if (today > nextIterationStart) {
    let goalDataUpdates = {};

    // set streakMet to 0
    goalDataUpdates.streakMet = 0;
    goalDataUpdates.currentIterationAmount = 0;

    if (goalData.streakMet) {
      // streak met
      goalDataUpdates.currentIterationStart = nextIterationStart;
    } else {
      let now = new Date();
      now.setUTCHours(0, 0, 0, 0);
      const startOfToday = firestore.Timestamp.fromDate(now);

      // streak failed
      goalDataUpdates.streak = 0;
      goalDataUpdates.currentIterationStart = startOfToday;
    }

    // send updates
    const result = await goalDoc.update(goalDataUpdates);

    console.log(`Streak reset for "${goalData.name}"`);

    return result;
  }

  return {
    status: 'success',
    message: 'No changes',
  };
}

// This is not scalable at all but I will work on changing this later, I really just want it functional for now
export async function checkAllStreaksReset(UID: string) {
  console.log('Checking if any streaks should be reset');

  const goals = await getGoals(UID);

  const result = await Promise.all(
    goals.map(goal => checkStreakReset(UID, goal.id, goal)),
  );

  return result;
}
