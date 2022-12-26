import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {ChipObject} from '../types';

import {checkStreakIncremented} from './goals';

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

  // Upload file to storage
  await reference.putFile(localPath);

  // Upload the chip to firestore
  await firestore().collection('users').doc(UID).collection('chips').add(chip);

  // Check if streak should be incremented
  await checkStreakIncremented(UID, goalId);
}
