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
  streak: number;
  streakMet: boolean;
  iterationPeriod: 'daily' | 'weekly' | '';
  iterationAmount: number;
  currentIterationProgress: number;
  currentIterationStart: FirebaseFirestoreTypes.Timestamp;
}

export interface ChipObject {
  goalId: string;
  timeSubmitted: FirebaseFirestoreTypes.Timestamp;
  photo: string;
  description: string;
}

export interface Reminder {
  id: string;
  goalId: string;
  notificationIntent: 'none' | 'remind' | 'prepare' | 'now';
  timeCreated: FirebaseFirestoreTypes.Timestamp;
  timeSent: FirebaseFirestoreTypes.Timestamp;
}

export interface DatabaseResponse {
  status: 'success' | 'error';
  code: string;
  message: string;
}
