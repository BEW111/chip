import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import {updateUserGoals} from '../redux/authSlice';
import {Goal} from '../types';

import {v4 as uuidv4} from 'uuid';

// Registers a new user from their email and password
// generates firestore document for the user
export async function createNewUser(email, password, newGoal) {
  try {
    const currentdt = new Date();

    const authResult = await auth().createUserWithEmailAndPassword(
      email,
      password,
    ); // register
    const UID = auth().currentUser.uid; // get uid for this user

    // Add user doc to firestore
    const firestoreResult = await firestore()
      .collection('users')
      .doc(UID)
      .set({
        username: '',
        friends: [],
        timeCreated: currentdt,
        goals: [newGoal],
      });

    console.log('User added to firestore!');
    return {
      status: 'success',
      authResult: authResult,
      firestoreResult: firestoreResult,
    };
  } catch (error) {
    return {
      status: 'error',
      code: error.code,
      message: error.message,
    };
  }
}

// Updates the local state for user goals
export async function dispatchUpdateUserGoals(UID, dispatch) {
  try {
    const userData = await firestore().collection('users').doc(UID).get(); // retrive user data from firestore
    dispatch(updateUserGoals(userData._data.goals));
  } catch (error) {
    console.log(error);
  }
}

// Submits a chip to firestore
export async function submitChip(photoFile, goal, desc, UID) {
  const currentdt = new Date();
  const localPath = photoFile.uri;
  const photoNameIndex = localPath.lastIndexOf('/') + 1;

  // Create a storage reference to the file that will be uploaded
  const url = `user/${UID}/chip-photo/${localPath.slice(photoNameIndex)}`;
  const reference = storage().ref(url);

  // Upload file to storage (ASYNC)
  reference
    .putFile(localPath)
    .then(r => {
      // Upload the chip to firestore (ASYNC)
      firestore()
        .collection('users')
        .doc(UID)
        .collection('chips')
        .add({
          goal: goal,
          description: desc,
          timeSubmitted: currentdt,
          photo: localPath.slice(photoNameIndex),
        })
        .then(() => {
          console.log('Chip added!');
        });
    })
    .catch(e => console.log(e));
}

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
