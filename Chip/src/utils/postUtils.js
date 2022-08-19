import storage from '@react-native-firebase/storage';

export async function submitChip(photoFile, verb, UID) {
  const currentdt = new Date();
  const localPath = photoFile.uri;
  const photoNameIndex = localPath.lastIndexOf('/') + 1;

  // Create a storage reference to the file that will be uploaded
  const url = `user/${UID}/chip-photo/${localPath.slice(photoNameIndex)}`;
  const reference = storage().ref(url);

  console.log(url);

  reference
    .putFile(localPath)
    .then(r => console.log(r))
    .catch(e => console.log(e));
}
