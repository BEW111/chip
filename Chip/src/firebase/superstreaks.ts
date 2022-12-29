/**
 * Superstreaks
 */

import firestore from '@react-native-firebase/firestore';

import {Goal, Superstreak} from '../types';

export async function createSuperstreak(
  senderUid: string,
  recepientUid: string,
  senderGoal: Goal,
  recepientGoal: Goal,
) {
  console.log('[createSuperstreak]');
  let now = new Date();
  const currentdt = firestore.Timestamp.fromDate(now);

  const superstreak: Superstreak = {
    users: [senderUid, recepientUid],
    goals: [senderGoal.id, recepientGoal.id],
    goalsMap: {
      senderUid: senderGoal.id,
      recepientUid: recepientGoal.id,
    },
    timeCreated: currentdt,
    streak: 0,
    streakPartiallyMet: false,
    streakPartiallyMetBy: '',
    streakMet: false,
    iterationPeriod: senderGoal.iterationPeriod, // TODO: validate that this is the same for both
  };

  await firestore().collection('superstreaks').add(superstreak);
}

// Update all superstreaks to potentially increase for a particular goal
// Should only be ran if the streak this iteration with achieved for this goal
export async function updateAndCheckSuperstreaksIncremented(
  uid: string,
  goalId: string,
) {
  console.log('[updateAndCheckSuperstreaksIncremented]');
  const superstreaks = await firestore()
    .collection('superstreaks')
    .where('goals', 'array-contains', goalId)
    .get();

  const superstreaksCompleted = await firestore()
    .collection('superstreaks')
    .where('goals', 'array-contains', goalId)
    .where('streakPartiallyMet', '==', true)
    .get();

  const batch = firestore().batch();

  superstreaks.docs.forEach(superstreak =>
    batch.update(superstreak.ref, {
      streakPartiallyMet: true,
      streakPartiallyMetBy: uid,
    }),
  );
  superstreaksCompleted.docs.forEach(superstreak => {
    batch.update(superstreak.ref, {
      streakMet: true,
      streak: firestore.FieldValue.increment(1),
    });
  });

  const result = await batch.commit();
  return result;
}

// Update all superstreaks to fail for a particular goal
// Should ONLY be ran if we're past the streak iteration period
// (i.e. we either move to the next stage or reset the superstreak)
export async function checkSuperstreaksReset(goalId: string) {
  console.log('[checkSuperstreaksReset]');

  const superstreaksPassed = await firestore()
    .collection('superstreaks')
    .where('goals', 'array-contains', goalId)
    .where('streakMet', '==', true)
    .get();

  const superstreaksFailed = await firestore()
    .collection('superstreaks')
    .where('goals', 'array-contains', goalId)
    .where('streakMet', '==', false)
    .get();

  const batch = firestore().batch();

  // Passed
  superstreaksPassed.docs.forEach(superstreak =>
    batch.update(superstreak.ref, {
      streakMet: false,
      streakPartiallyMet: false,
      streakPartiallyMetBy: '',
    }),
  );

  // Failed
  superstreaksFailed.docs.forEach(superstreak =>
    batch.update(superstreak.ref, {
      streakMet: false,
      streakPartiallyMet: false,
      streakPartiallyMetBy: '',
      streak: 0,
    }),
  );

  const result = await batch.commit();
  return result;
}
