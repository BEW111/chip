import storage from '@react-native-firebase/storage';

export async function submitChip(photoFile, verb) {
  const currentdt = new Date();
  const photoNameIndex = photoFile.uri.lastIndexOf('/') + 1;

  // Create a storage reference to the file that will be uploaded
  const reference = storage().ref('chip-photo-' + photoNameIndex);

  await reference.putFile(photoFile.uri);
}

// export function getBase64(file, callback) {
//   RNFS.readFile(file, 'base64')
//     .then(r => {
//       callback(r);
//     })
//     .catch(e => {
//       console.log(e);
//       callback('MISSING_PHOTO');
//     });
// }

// export function submitChip(photoFile, verb) {
//   const currentdt = new Date();
//   const photoNameIndex = photoFile.uri.lastIndexOf('/') + 1;

//   let form_data = new FormData();
//   form_data.append('verb', verb);
//   // form_data.append('photo', photoFile.uri, photoFile.uri.slice(photoNameIndex));
//   // form_data.append('timeSubmitted', currentdt);

//   console.log(form_data);

//   let url = 'http://bew.local:8000/chips/';
//   // fetch(url, {
//   //   method: 'get',
//   // })
//   //   .then(r => r.text())
//   //   .then(r => {
//   //     console.log(r);
//   //   })
//   //   .catch(e => {
//   //     console.log(e);
//   //   });

//   // fetch(url, {
//   //   method: 'post',
//   //   body: form_data,
//   // })
//   //   .then(r => {
//   //     console.log(r);
//   //   })
//   //   .catch(e => {
//   //     console.log(e);
//   //   });

//   fetch(url, {
//     method: 'post',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       verb: 'push-up',
//       photo: 'http://bew.local:8000/media/chips/download.jpeg',
//       timeSubmitted: '2022-08-10T11:30:00Z',
//     }),
//   })
//     .then(r => {
//       console.log(r);
//     })
//     .catch(e => {
//       console.log(e);
//     });
// }
