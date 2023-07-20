// import storage from '@react-native-firebase/storage';
// import firestore from '@react-native-firebase/firestore';
// import {FirebaseStorageTypes} from '@react-native-firebase/storage';

// import {PhotoSource} from '../types/camera';

// // Creates a storage reference (synchronously) for a photo
// // We expect PhotoSource to be valid
// export function createPhotoStorageReference(
//   photoSource: PhotoSource,
//   uid: string,
// ) {
//   // Throw a proper error here if there is no photo
//   if (photoSource.uri) {
//     let localPath = photoSource.uri;
//     let photoNameIndex = localPath.lastIndexOf('/') + 1;
//     let photoName = localPath.slice(photoNameIndex);

//     // Create a storage reference to the file that will be uploaded
//     const url = `user/${uid}/chip-photo/${photoName}`;
//     let reference: FirebaseStorageTypes.Reference = storage().ref(url);

//     return {
//       localPath: photoSource.uri,
//       photoName,
//       reference,
//     };
//   } else {
//     throw Error('No photoSource.uri provided');
//   }
// }

// // Uploads a local photo to cloud storage, given a reference and local path
// export async function uploadChipPhoto(
//   reference: FirebaseStorageTypes.Reference,
//   localPath: string,
// ) {
//   try {
//     await reference.putFile(localPath);
//   } catch {
//     throw Error('Uploading photo to cloud storage failed');
//   }
// }

// // Uploads chip info to Firestore, given a photo name and chip data
// export async function uploadChip(
//   goalId: string,
//   desc: string,
//   uid: string,
//   amount: number,
//   photoName: string,
// ) {
//   const currentdt = new Date();
//   const chip: ChipObject = {
//     goalId: goalId,
//     description: desc,
//     timeSubmitted: firestore.Timestamp.fromDate(currentdt),
//     photo: photoName,
//     amount: amount,
//   };

//   try {
//     await firestore()
//       .collection('users')
//       .doc(uid)
//       .collection('chips')
//       .add(chip);
//   } catch {
//     throw Error('Uploading chip to Firestore failed');
//   }
// }

// // Deletes a particular chip
// export async function deleteChip(uid: string, chipId: string) {
//   console.log('[deleteChip] Deleting chip');

//   const result = await firestore()
//     .collection('users')
//     .doc(uid)
//     .collection('chips')
//     .doc(chipId)
//     .delete();

//   return result;
// }
