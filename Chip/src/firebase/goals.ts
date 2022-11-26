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

// Gets all goals for a particular user
export async function getGoals(UID) {
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
export async function addGoal(UID, goalName, goalDesc, goalType, dispatch) {
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
      name: name,
    }),
  );

  return goalId;
}

// Edits the name of an existing goal, given its ID
// TODO: update local state
export async function editGoalName(UID, goalId, newName, dispatch) {
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
export async function deleteGoal(UID, goalId, dispatch) {
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
export async function dispatchUpdateUserGoals(UID, dispatch) {
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
