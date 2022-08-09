import RNFS from 'react-native-fs';

export function getBase64(file, callback) {
  RNFS.readFile(file, 'base64')
    .then(r => {
      callback(r);
    })
    .catch(e => {
      console.log(e);
      callback('MISSING_PHOTO');
    });
}
