/**
 * Everything having to do with authentication and private users
 */

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

// Registers a new user from their email and password
// generates firestore document for the user
export async function createNewUser(username, email, password, newGoal) {
  try {
    const currentdt = new Date();

    // check if the username is taken first
    const snapshot = await firestore()
      .collection('usersPublic')
      .where('username', '==', username)
      .get();
    if (snapshot.docs.length > 0) {
      return {
        status: 'success',
        code: 'user/username-taken',
        message: 'This username is already taken',
      };
    }

    const authResult = await auth().createUserWithEmailAndPassword(
      email,
      password,
    ); // register
    const UID = auth().currentUser.uid; // get uid for this user

    // add extra details
    const extraDetails = {
      displayName: username,
    };
    await auth().currentUser.updateProfile(extraDetails);

    // Add user doc to firestore (private user data)
    let firestoreResult = await firestore()
      .collection('users')
      .doc(UID)
      .set({
        email: email,
        username: username,
        friends: [],
        timeCreated: currentdt,
        goals: [newGoal],
      });

    console.log('User added to firestore!');

    // Add user doc to firestore (public user data)
    firestoreResult = await firestore().collection('usersPublic').doc(UID).set({
      email: email,
      username: username,
      invitesSent: [],
      invitesAccepted: [],
      goalsPublic: [],
    });
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

export async function updateUsername(username) {
  try {
    // check if the username is taken first
    const snapshot = await firestore()
      .collection('usersPublic')
      .where('username', '==', username)
      .get();
    if (snapshot.docs.length > 0) {
      return {
        status: 'error',
        code: 'user/username-taken',
        message: 'This username is already taken',
      };
    }

    // update auth display name
    const extraDetails = {
      displayName: username,
    };
    const authResult = await auth().currentUser.updateProfile(extraDetails);
    const UID = auth().currentUser.uid; // get uid for this user

    // Add user doc to firestore
    const firestoreResult = await firestore()
      .collection('usersPublic')
      .doc(UID)
      .update({
        username: username,
      });

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
