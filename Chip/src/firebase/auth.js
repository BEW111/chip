/**
 * Everything having to do with authentication and private users
 */

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

// Registers a new user from their email and password
// generates firestore document for the user
export async function createNewUser(username, email, password, newGoal) {
  console.log('[createNewUser]');
  try {
    const currentdt = new Date();

    // check if the username is taken first
    const snapshot = await firestore()
      .collection('usersPublic')
      .where('username', '==', username)
      .get();
    if (snapshot.docs.length > 0) {
      console.log('test2');
      return {
        status: 'error',
        code: 'user/username-taken',
        message: 'This username is already taken',
      };
    }

    console.log('[createNewUser] test');

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

    console.log('[createNewUser] User created!');

    // Add user doc to firestore (private user data)
    let firestoreResult = await firestore()
      .collection('users')
      .doc(UID)
      .set({
        uid: UID,
        email: email,
        username: username,
        friends: [],
        timeCreated: currentdt,
        goals: [newGoal],
      });

    console.log('[createNewUser] User added to firestore!');

    // Add user doc to firestore (public user data)
    firestoreResult = await firestore().collection('usersPublic').doc(UID).set({
      uid: UID,
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

export async function uploadProfileImage(profileImage, uid: string) {
  let localPath = null;
  let photoNameIndex = null;

  let reference: FirebaseStorageTypes.Reference | null = null;

  // we may be developing on the simulator
  // TODO: should throw an actual error in prod?
  if (profileImage.uri) {
    localPath = profileImage.uri;
    photoNameIndex = localPath.lastIndexOf('/') + 1;

    // Create a storage reference to the file that will be uploaded
    const url = `user/${uid}/profile-image/profile`;
    reference = storage().ref(url);
  } else {
    console.log('No photo provided');
    return {
      status: 'error',
      message: 'No photo provided',
    };
  }

  // Upload file to storage
  if (reference) {
    console.log('Uploading profile image');
    await reference.putFile(localPath);
  }

  console.log('Finished uploading profile image');
}
