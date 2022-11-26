import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface ChipUser {
  username: string;
  goals: string[];
  timeCreated: FirebaseFirestoreTypes.Timestamp;
  profilePicId?: string;
}

export interface Goal {
  id: string; // actual identifier of the goal
  name: string; // display name of the goal
  timeCreated: FirebaseFirestoreTypes.Timestamp;
  description?: string;
  type?: 'form' | 'break' | 'do' | '';
  category?: string;
  streak?: number;
}

export interface ChipObject {
  key: string;
  goalId: string;
  timeSubmitted: FirebaseFirestoreTypes.Timestamp;
  photo: string;
  description: string;
}
