import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {ChipObject} from '../types';

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

    // Add user doc to firestore
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

    // Add user doc to firestore
    firestoreResult = await firestore().collection('usersPublic').doc(UID).set({
      email: email,
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

// export async function editUsername(username, UID)

// Submits a chip to firestore
export async function submitChip(photoFile, goalId, desc, UID) {
  const currentdt = new Date();
  const localPath = photoFile.uri;
  const photoNameIndex = localPath.lastIndexOf('/') + 1;

  // Create a storage reference to the file that will be uploaded
  const url = `user/${UID}/chip-photo/${localPath.slice(photoNameIndex)}`;
  const reference = storage().ref(url);

  const chip: ChipObject = {
    goalId: goalId,
    description: desc,
    timeSubmitted: firestore.Timestamp.fromDate(currentdt),
    photo: localPath.slice(photoNameIndex),
  };

  // Upload file to storage (ASYNC)
  reference
    .putFile(localPath)
    .then(r => {
      // Upload the chip to firestore (ASYNC)
      firestore()
        .collection('users')
        .doc(UID)
        .collection('chips')
        .add(chip)
        .then(() => {
          console.log('Chip added!');
        });
    })
    .catch(e => console.log(e));
}
