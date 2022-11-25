import firestore from '@react-native-firebase/firestore';

import {Goal} from '../types';

import {v4 as uuidv4} from 'uuid';

// Adds a goal to firestore
// generates a unique ID for it, and returns the id
export async function addGoal(goalId, goalName) {
  const uid = uuidv4();

  console.log('Adding goal');
  console.log(goalId);
  console.log(uid);

  const newGoal: Goal = {
    id: goalId,
    name: goalName,
  };

  await firestore()
    .collection('users')
    .doc(uid)
    .update({
      goals: firestore.FieldValue.arrayUnion(newGoal),
    });
  return uid;
}

// Edits a goal (currently just changes the name of the goal)
export async function editGoal(UID, goalId, newName) {
  console.log('Editing goal');
  console.log(goalId);
  console.log(UID);
}

// Removes a goal for a user (currently doesn't remove chips)
export async function deleteGoal(UID, goal) {
  console.log('Deleting goal');
  console.log(goal);
  console.log(UID);

  firestore()
    .collection('users')
    .doc(UID)
    .update({
      goals: firestore.FieldValue.arrayRemove(goal),
    });
}
