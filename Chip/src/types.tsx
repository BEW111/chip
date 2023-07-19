import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface User {
  uid: string;
  username: string;
  goals: string[];
  timeCreated: FirebaseFirestoreTypes.Timestamp;
  profilePicId?: string;
}

export interface PublicUser {
  uid: string;
  username: string;
  email: string;
  goals: string[];
  profileImage?: ProfileImage;
}

type UserGoalMap = {
  [key: string]: string;
};

export interface Superstreak {
  users: string[];
  goalsMap: UserGoalMap;
  goals: string[];
  timeCreated: FirebaseFirestoreTypes.Timestamp;
  streak: number;
  streakPartiallyMet: boolean;
  streakPartiallyMetBy: string;
  streakMet: boolean;
  iterationPeriod: GoalIterationPeriod;
}

export interface ChipObject {
  goalId: string;
  timeSubmitted: FirebaseFirestoreTypes.Timestamp;
  photo: string;
  description: string;
  amount?: number;
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

export interface ProfileImage {
  uri: string;
}
