import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {FirebaseStorageTypes} from '@react-native-firebase/storage';
import {ChipObject} from '../types';

import {updateAndCheckStreakIncremented} from './goals';

// export async function editUsername(username, UID)

// Submits a chip to firestore
export async function submitChip(
  photoFile,
  goalId: string,
  desc: string,
  UID: string,
  amount: number,
) {
  const currentdt = new Date();

  let localPath = null;
  let photoNameIndex = null;

  let reference: FirebaseStorageTypes.Reference | null = null;

  // we may be developing on the simulator
  // TODO: should throw an actual error in prod?
  if (photoFile.uri) {
    localPath = photoFile.uri;
    photoNameIndex = localPath.lastIndexOf('/') + 1;

    // Create a storage reference to the file that will be uploaded
    const url = `user/${UID}/chip-photo/${localPath.slice(photoNameIndex)}`;
    reference = storage().ref(url);
  } else {
    console.log('No photo provided');
  }

  const chip: ChipObject = {
    goalId: goalId,
    description: desc,
    timeSubmitted: firestore.Timestamp.fromDate(currentdt),
    photo: localPath ? localPath.slice(photoNameIndex) : null,
    amount: amount,
  };

  console.log('Chip being submitted: ' + chip);

  // Upload file to storage
  if (reference) {
    console.log('Uploading image');
    await reference.putFile(localPath);
  }

  // Upload the chip to firestore
  await firestore().collection('users').doc(UID).collection('chips').add(chip);

  // Check if streak should be incremented
  await updateAndCheckStreakIncremented(UID, goalId, amount);
}
