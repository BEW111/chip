import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface Goal {
  id: string; // actual identifier of the goal
  name: string; // display name of the goal
  streak?: number;
}

export interface ChipObject {
  key: string;
  goalId: string;
  timeSubmitted: FirebaseFirestoreTypes.Timestamp;
  photo: string;
  description: string;
}
