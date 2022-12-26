import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

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
