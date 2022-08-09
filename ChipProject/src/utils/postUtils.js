import RNFS from 'react-native-fs';
import axios from 'axios';

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

export function submitChip(photoFile, verb) {
  const currentdt = new Date();
  const photoNameIndex = photoFile.uri.lastIndexOf('/') + 1;

  let form_data = new FormData();
  form_data.append('verb', verb);
  form_data.append('photo', photoFile.uri, photoFile.uri.slice(photoNameIndex));
  form_data.append('timeSubmitted', currentdt);

  let url = 'http://127.0.0.1:8000/';
  fetch(url, {
    method: 'get',
  })
    .then(r => {
      console.log(r);
    })
    .catch(e => {
      console.log(e);
    });

  // fetch(url, {
  //   method: 'post',
  //   body: form_data,
  // })
  //   .then(r => {
  //     console.log(r);
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   });
}
