import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

// The data for an ordinary story posted by a user
export type StorySubmission = {
  image: string;
  message: string;
};

// The below data types are used for the stories that are on people's feeds, so
// we need to keep track of data like "viewed" and who originally posted it

// Each user has a group of stories (because they may have posted multiple)
// We also need to keep track of when it was last updated
export type FeedUserStoryGroupFB = {
  uid: string;
  stories: FeedStoryDataFB[];
  dateLastUpdated: FirebaseFirestoreTypes.Timestamp;
};
export type FeedUserStoryGroup = {
  uid: string;
  stories: FeedStoryData[];
  dateLastUpdated: string;
};

// Note that this data is particular to a certain user's feed
export type FeedStoryDataFB = {
  datePosted: FirebaseFirestoreTypes.Timestamp;
  imageUrl: string; // Actual URL to the image
  message: string;
  viewed: boolean;
};
export type FeedStoryData = {
  datePosted: string;
  imageUrl: string; // Actual URL to the image
  message: string;
  viewed: boolean;
};
