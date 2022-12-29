/**
 * For dealing with public user data
 */

import {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {Dispatch} from '@reduxjs/toolkit';

import {
  addInviteSent,
  updateInvitesSent,
  updateFriends,
  addFriend,
} from '../redux/authSlice';

// export function useReceivedInvites(uid: string) {
//   const [received, setReceived] = useState([]);

//   useEffect(() => {
//     const query = firestore()
//       .collection('usersPublic')
//       .where('invitesSent', 'array-contains', uid)
//       .limit(10);

//     const subscriber = query.onSnapshot(
//       querySnapshot => {
//         const docs = querySnapshot.docs;
//         Promise.all(docs.map(doc => getUser(doc.id))).then(dataArray =>
//           setReceived(dataArray.map((data, i) => ({...data, id: docs[i].id}))),
//         );
//       },
//       err => {
//         console.log(`Encountered error: ${err}`);
//       },
//     );
//   });

//   return received;
// }

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

// export async function inviteUser(
//   senderUid: string,
//   invitedUid: string,
//   dispatch: Dispatch,
// ) {
//   try {
//     console.log('Sending friend invite to user');

//     // check if we're sending an invite to ourselves
//     if (senderUid === invitedUid) {
//       return {
//         status: 'error',
//         message: 'Cannot send friend invite to yourself',
//       };
//     }

//     const result = await firestore()
//       .collection('usersPublic')
//       .doc(senderUid)
//       .update({
//         invitesSent: firestore.FieldValue.arrayUnion(invitedUid),
//       });

//     dispatch(
//       addInviteSent({
//         uid: invitedUid,
//       }),
//     );

//     return result;
//   } catch (error) {
//     return {
//       status: 'error',
//     };
//   }
// }

// export async function acceptInvite(
//   senderUid: string, // should be a different user
//   invitedUid: string, // should be the current user
//   dispatch: Dispatch,
// ) {
//   try {
//     console.log('Accepting friend invite');

//     // check if we're sending an invite to ourselves
//     if (senderUid === invitedUid) {
//       return {
//         status: 'error',
//         message: 'Cannot accept own invite',
//       };
//     }

//     // check whether or not the sender actually invited us
//     const senderSnapshot = await firestore()
//       .collection('usersPublic')
//       .doc(senderUid)
//       .get();

//     if (!senderSnapshot?.data()?.invitesSent.includes(invitedUid)) {
//       return {
//         status: 'error',
//         message: 'Current user did not receive a friend invite from this user',
//       };
//     }

//     const result = await firestore()
//       .collection('usersPublic')
//       .doc(invitedUid)
//       .update({
//         invitesAccepted: firestore.FieldValue.arrayUnion(senderUid),
//         friends: firestore.FieldValue.arrayUnion(senderUid),
//       });

//     dispatch(
//       addFriend({
//         uid: senderUid,
//       }),
//     );

//     return result;
//   } catch (error) {
//     return {
//       status: 'error',
//     };
//   }
// }

export async function getUser(uid: string) {
  try {
    const snapshot = await firestore().collection('usersPublic').doc(uid).get();
    return snapshot.data();
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getUsers(uids: string[]) {
  if (uids.length > 0) {
    console.log('[getUsers] Getting users: ' + uids);
    try {
      console.log(uids);
      const snapshot = await firestore()
        .collection('usersPublic')
        .where('uid', 'in', uids)
        .get();

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.log(error);
      return error;
    }
  } else {
    const msg = 'Empty array provided to `getUsers`';
    console.log(msg);
    return {
      status: 'success',
      message: msg,
    };
  }
}

// export async function dispatchRefreshInvitesAndFriends(
//   UID: string,
//   dispatch: Dispatch,
// ) {
//   try {
//     const snapshot = await firestore().collection('usersPublic').doc(UID).get();
//     const data = snapshot.data();

//     const invitesSent = data.invitesSent; // retrive data from firestore
//     const friends = data.friends;
//     dispatch(updateInvitesSent(invitesSent));
//     dispatch(updateFriends(friends));
//   } catch (error) {
//     console.log(error);
//   }
// }
