import firestore from '@react-native-firebase/firestore';

import {Goal} from '../types';

import {v4 as uuidv4} from 'uuid';

// Creates a new goal to add for this user
// generates a random unique ID, and returns it
export async function addGoal(UID, goalName, goalDesc, goalType) {
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
    .set(goal)
    .then(() => {
      console.log('Goal added!');
    });

  return goalId;
}

// Edits the name of an existing goal, given its ID
export async function editGoalName(UID, goalId, newName) {
  console.log('Editing goal name');
  await firestore()
    .collection('users')
    .doc(UID)
    .collection('goals')
    .doc(goalId)
    .update({
      name: newName,
    });

  return goalId;
}

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

// Removes a goal for a user (currently doesn't remove chips)
export async function deleteGoal(UID, goalId) {
  console.log('Deleting goal');

  const result = await firestore()
    .collection('users')
    .doc(UID)
    .collection('goals')
    .doc(goalId)
    .delete();

  return result;
}

// // Adds a goal to firestore
// // generates a unique ID for it, and returns the id
// export async function addGoal(goalId, goalName) {
//   const uid = uuidv4();

//   console.log('Adding goal');
//   console.log(goalId);
//   console.log(uid);

//   const newGoal: Goal = {
//     id: goalId,
//     name: goalName,
//   };

//   await firestore()
//     .collection('users')
//     .doc(uid)
//     .update({
//       goals: firestore.FieldValue.arrayUnion(newGoal),
//     });
//   return uid;
// }
