import React, {useEffect, useState} from 'react';

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export async function checkUsernameTaken(username: String) {
  try {
    const snapshot = await firestore()
      .collection('usersPublic')
      .where('username', '==', username)
      .get();
    return snapshot.docs.length > 0;
  } catch (error) {
    return error;
  }
}

export async function searchUsers(search: string) {
  try {
    const snapshot = await firestore()
      .collection('usersPublic')
      .orderBy('username')
      .startAt(search)
      .endAt(search + '~')
      .limit(10)
      .get();
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    return error;
  }
}

// export async function searchUsers(username) {
//     const firestoreResult = await firestore()
//       .collection('users')
//       .
// }
