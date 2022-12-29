/**
 * For dealing with friends
 */

import {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {Dispatch} from '@reduxjs/toolkit';

import {getUsers} from './usersPublic';

import {
  addInviteSent,
  updateInvitesSent,
  updateFriends,
  addFriend,
} from '../redux/authSlice';

const QUERY_LIMITS = 10;

/*
 * Sends a friend request to a particular user
 */
export async function inviteUser(
  senderUid: string,
  invitedUid: string,
  dispatch: Dispatch,
) {
  try {
    console.log(`Sending friend invite to user ${invitedUid}`);

    // check if we're sending an invite to ourselves
    if (senderUid === invitedUid) {
      return {
        status: 'error',
        message: 'Cannot send friend invite to yourself',
      };
    }

    // check if we've already received an invite from this user
    const snapshot = await firestore()
      .collection('friends')
      .where('senderId', '==', invitedUid)
      .where('recepientId', '==', senderUid)
      .get();

    if (snapshot.docs.length > 0) {
      // accept the invite
      const friendDoc = snapshot.docs[0].id;

      const result = await firestore()
        .collection('friends')
        .doc(friendDoc)
        .update({
          accepted: true,
        });

      dispatch(
        addFriend({
          uid: senderUid,
        }),
      );

      console.log(`Accepted existing invite from ${invitedUid}`);

      return result;
    }

    // Add a new friendship doc
    const result = await firestore().collection('friends').add({
      senderId: senderUid,
      recepientId: invitedUid,
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

/**
 * Accepts an invite
 * After accepting, adds a "users" field to the friendship document to allow for easier querying
 */
export async function acceptInvite(
  senderUid: string, // should be a different user
  invitedUid: string, // should be the current user
  dispatch: Dispatch,
) {
  try {
    console.log(`Accepting friend invite from ${senderUid}`);

    // check if we're sending an invite to ourselves
    if (senderUid === invitedUid) {
      return {
        status: 'error',
        message: 'Cannot accept own invite',
      };
    }

    // check whether or not the sender actually invited us
    const snapshot = await firestore()
      .collection('friends')
      .where('senderId', '==', senderUid)
      .where('recepientId', '==', invitedUid)
      .get();

    if (snapshot.docs.length === 0) {
      return {
        status: 'error',
        message: 'Current user did not receive a friend invite from this user',
      };
    }

    const friendDoc = snapshot.docs[0].id;

    const result = await firestore()
      .collection('friends')
      .doc(friendDoc)
      .update({
        accepted: true,
        users: [senderUid, invitedUid],
      });

    dispatch(
      addFriend({
        uid: senderUid,
      }),
    );

    return {
      status: 'success',
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
    };
  }
}

/**
 * Hook to keep track of all pending invites to self
 */
export function useReceivedInvites(uid: string) {
  const [received, setReceived] = useState([]);

  useEffect(() => {
    const query = firestore()
      .collection('friends')
      .where('recepientId', '==', uid)
      .where('accepted', '!=', true)
      .limit(QUERY_LIMITS);

    const subscriber = query.onSnapshot(
      querySnapshot => {
        const uids = querySnapshot.docs.map(doc => doc.data().senderId);

        if (uids.length > 0) {
          getUsers(uids).then(dataArray => setReceived(dataArray));
        }
      },
      err => {
        console.log(`Encountered error: ${err}`);
      },
    );
  }, [uid]);

  return received;
}

/**
 * Refresh invites that we sent and our friends locally
 */
export async function dispatchRefreshInvitesAndFriends(
  UID: string,
  dispatch: Dispatch,
) {
  console.log(
    '[dispatchRefreshInvitesAndFriends] Refreshing sent invites and friends locally',
  );

  try {
    const sentInvitesSnapshot = await firestore()
      .collection('friends')
      .where('senderId', '==', UID)
      .limit(QUERY_LIMITS)
      .get();
    const friendsSnapshot = await firestore()
      .collection('friends')
      .where('users', 'array-contains', UID)
      .limit(QUERY_LIMITS)
      .get();

    const sentInvites = sentInvitesSnapshot.docs.map(
      doc => doc.data().recepientId,
    );
    const friends = friendsSnapshot.docs.map(
      doc => doc.data().users.filter(user => user !== UID)[0],
    );

    dispatch(updateInvitesSent(sentInvites));
    dispatch(updateFriends(friends));
  } catch (error) {
    console.log(error);
  }
}
