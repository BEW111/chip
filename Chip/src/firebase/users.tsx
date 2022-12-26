/**
 * For dealing with users and friends
 */

import React, {useEffect, useState} from 'react';

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {addInviteSent} from '../redux/authSlice';

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
    return snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function inviteUser(
  senderUid: string,
  invitedUid: string,
  dispatch,
) {
  try {
    console.log('Sending friend invite to user');

    // check if we're sending an invite to ourselves
    if (senderUid === invitedUid) {
      return {
        status: 'error',
        message: 'Cannot send friend invite to yourself',
      };
    }

    console.log(invitedUid);

    const result = await firestore()
      .collection('usersPublic')
      .doc(senderUid)
      .update({
        invitesSent: firestore.FieldValue.arrayUnion(invitedUid),
      });

    dispatch(
      addInviteSent({
        uid: invitedUid,
      }),
    );

    return result;
  } catch (error) {
    return {
      status: 'error',
    };
  }
}

// export async function searchUsers(username) {
//     const firestoreResult = await firestore()
//       .collection('users')
//       .
// }
