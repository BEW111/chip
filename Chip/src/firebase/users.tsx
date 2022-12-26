/**
 * For dealing with users and friends
 */

import React, {useEffect, useState} from 'react';

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Dispatch} from '@reduxjs/toolkit';

import {
  addInviteSent,
  updateInvitesSent,
  updateFriends,
} from '../redux/authSlice';

export function useReceivedInvites(uid: string) {
  const [received, setReceived] = useState([]);

  useEffect(() => {
    const query = firestore()
      .collection('usersPublic')
      .where('invitesSent', 'array-contains', uid)
      .limit(10);

    const subscriber = query.onSnapshot(
      querySnapshot => {
        Promise.all(querySnapshot.docs.map(doc => getUser(doc.id))).then(
          dataArray => setReceived(dataArray),
        );
      },
      err => {
        console.log(`Encountered error: ${err}`);
      },
    );
  });

  return received;
}

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
  dispatch: Dispatch,
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

export async function getUser(uid: string) {
  try {
    const snapshot = await firestore().collection('usersPublic').doc(uid).get();
    return snapshot.data();
  } catch (error) {
    console.log(error);
    return error;
  }
}

// Updates the local state for user goals
// TODO: rename to "dispatchRefreshUserGoals"
export async function dispatchRefreshInvitesAndFriends(
  UID: string,
  dispatch: Dispatch,
) {
  try {
    const snapshot = await firestore().collection('usersPublic').doc(UID).get();
    const data = snapshot.data();

    const invitesSent = data.invitesSent; // retrive data from firestore
    const friends = data.friends;
    dispatch(updateInvitesSent(invitesSent));
    dispatch(updateFriends(friends));
  } catch (error) {
    console.log(error);
  }
}

// export async function searchUsers(username) {
//     const firestoreResult = await firestore()
//       .collection('users')
//       .
// }
