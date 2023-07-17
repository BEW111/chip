import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {
  FeedStoryDataFB,
  FeedUserStoryGroup,
  StorySubmission,
} from '../types/stories';

// Post our story to all of the other feeds for our friends
export async function postStory(
  storyData: StorySubmission,
  postedFromUid: string,
  friendUidArray: string[],
) {
  // We also need to calculate the downloadable URL for the image
  // which will allow us to only calculate it a single time
  // instead of every time anyone views it
  const path = `user/${postedFromUid}/chip-photo/${storyData.image}`;
  let newUrl: string | null = null;

  try {
    newUrl = await storage().ref(path).getDownloadURL();
    console.log(newUrl);
  } catch {
    console.error(
      "Failed to post story because couldn't find image download URL",
    );
    return;
  }

  const currentdt = new Date();
  const story: FeedStoryDataFB = {
    datePosted: firestore.Timestamp.fromDate(currentdt),
    imageUrl: newUrl,
    message: storyData.message,
    viewed: false,
  };
  const userStoryGroup = {
    uid: postedFromUid,
    stories: firestore.FieldValue.arrayUnion(story),
    dateLastUpdated: firestore.Timestamp.fromDate(currentdt),
  };

  const batch = firestore().batch();

  friendUidArray.forEach(friendUid => {
    const ref = firestore()
      .collection('story-feeds')
      .doc(friendUid)
      .collection('feed')
      .doc(postedFromUid);

    batch.set(ref, userStoryGroup, {merge: true});
  });

  try {
    await batch.commit();
  } catch (error) {
    let errorMessage = 'Failed upload story';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
  }
}

// Fetch the story feed for a particular user
// For now, we'll implement stories as a one-time read with refreshing,
// but maybe in the future I can think about how to implement realtime updates
export async function fetchStoriesFromFirestore(uid: string) {
  // Mock fetch from FB
  // const storiesDemoData: FeedUserStoryGroupFB[] = [
  //   {
  //     uid: 'bob',
  //     stories: [
  //       {
  //         datePosted: firestore.Timestamp.now(),
  //         image: 'cool image of bob',
  //         message: 'hi im bob',
  //         viewed: false,
  //       },
  //     ],
  //     dateLastUpdated: firestore.Timestamp.now(),
  //   },
  //   {
  //     uid: 'blair',
  //     stories: [
  //       {
  //         datePosted: firestore.Timestamp.now(),
  //         image: 'cool image of blair',
  //         message: 'blair message',
  //         viewed: false,
  //       },
  //     ],
  //     dateLastUpdated: firestore.Timestamp.now(),
  //   },
  //   {
  //     uid: 'tj strawberry',
  //     stories: [
  //       {
  //         datePosted: firestore.Timestamp.now(),
  //         image: 'cool image of tj',
  //         message: '🍓',
  //         viewed: false,
  //       },
  //       {
  //         datePosted: firestore.Timestamp.now(),
  //         image: 'another cool image of tj',
  //         message: 'tj on that strawberry',
  //         viewed: false,
  //       },
  //     ],
  //     dateLastUpdated: firestore.Timestamp.now(),
  //   },
  //   {
  //     uid: 'casey',
  //     stories: [
  //       {
  //         datePosted: firestore.Timestamp.now(),
  //         image: 'cool image of casey',
  //         message: 'casey message',
  //         viewed: false,
  //       },
  //     ],
  //     dateLastUpdated: firestore.Timestamp.now(),
  //   },
  // ];
  const storiesSnapshot = await firestore()
    .collection('story-feeds')
    .doc(uid)
    .collection('feed')
    .get();

  const storiesDataFormatted: FeedUserStoryGroup[] = storiesSnapshot.docs.map(
    doc => ({
      dateLastUpdated: doc.data().dateLastUpdated.toDate().toISOString(),
      stories: doc.data().stories.map((story: FeedStoryDataFB) => ({
        ...story,
        datePosted: story.datePosted.toDate().toISOString(),
      })),
      uid: doc.data().uid,
    }),
  );

  return storiesDataFormatted;
}
