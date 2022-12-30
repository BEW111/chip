/**
 * Superstreaks
 */

import firestore from '@react-native-firebase/firestore';

import {GoalIterationPeriod, Superstreak} from '../types';

export async function createSuperstreak(
  senderUid: string,
  recepientUid: string,
  senderGoalId: string,
  recepientGoalId: string,
  iterationPeriod: GoalIterationPeriod,
) {
  console.log('[createSuperstreak]');
  let now = new Date();
  const currentdt = firestore.Timestamp.fromDate(now);

  const superstreak: Superstreak = {
    users: [senderUid, recepientUid],
    goals: [senderGoalId, recepientGoalId],
    goalsMap: {
      [senderUid]: senderGoalId,
      [recepientUid]: recepientGoalId,
    },
    timeCreated: currentdt,
    streak: 0,
    streakPartiallyMet: false,
    streakPartiallyMetBy: '',
    streakMet: false,
    iterationPeriod: iterationPeriod, // TODO: validate that this is the same for both
  };

  console.log(superstreak);

  await firestore().collection('superstreaks').add(superstreak);
}

// get all superstreaks for a particular goal
export async function getSuperstreaks(goalId: string) {
  const superstreaks = await firestore()
    .collection('superstreaks')
    .where('goals', 'array-contains', goalId)
    .get();
  return superstreaks.docs.map(doc => doc.data());
}

// Update all superstreaks to potentially increase for a particular goal
// Should only be ran if the streak this iteration with achieved for this goal
export async function updateAndCheckSuperstreaksIncremented(
  uid: string,
  goalId: string,
) {
  console.log('[updateAndCheckSuperstreaksIncremented]');
  const superstreaksNotCompleted = await firestore()
    .collection('superstreaks')
    .where('goals', 'array-contains', goalId)
    .where('streakPartiallyMet', '==', false)
    .get();

  const superstreaksCompleted = await firestore()
    .collection('superstreaks')
    .where('goals', 'array-contains', goalId)
    .where('streakPartiallyMet', '==', true)
    .get();

  const batch = firestore().batch();

  superstreaksNotCompleted.docs.forEach(superstreak =>
    batch.update(superstreak.ref, {
      streakPartiallyMet: true,
      streakPartiallyMetBy: uid,
    }),
  );
  superstreaksCompleted.docs.forEach(superstreak => {
    console.log(superstreak);
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
