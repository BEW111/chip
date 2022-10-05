import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {updateUserGoals} from '../redux/authSlice';

// Registers a new user from their email and password
// generates firestore document for the user
export async function createNewUser(email, password, newGoal) {
  try {
    const currentdt = new Date();

    const result = await auth().createUserWithEmailAndPassword(email, password); // register
    const UID = auth().currentUser.uid; // get uid for this user

    // Add user doc to firestore
    await firestore()
      .collection('users')
      .doc(UID)
      .set({
        username: '',
        timeCreated: currentdt,
        goals: [newGoal],
      });

    console.log('User added to firestore!');
  } 
  catch (error) {
    console.log(error);

    if (error.code) {
      console.log(error.code);
    }
  }
}

export async function dispatchUpdateUserGoals(UID, dispatch) {
  try {
    const userData = await firestore().collection('users').doc(UID).get(); // retrive user data from firestore
    dispatch(updateUserGoals(userData._data.goals));
  }
  catch (error) {
    console.log(error);
  }
}

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

export async function addGoal(goal, UID) {
  const url = `user/${UID}`;

  firestore()
    .collection('users')
    .doc(UID)
    .update({
      goals: firestore.FieldValue.arrayUnion(goal),
    })
}