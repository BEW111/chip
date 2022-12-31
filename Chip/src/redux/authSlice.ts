import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Goal, ProfileImage} from '../types';
import {RootState} from './store';

interface AuthState {
  initializing: boolean;
  newlyCreated: boolean;
  user: {} | null;
  uid: string | null;
  userGoals: Goal[];
  friends: string[];
  invitesSent: string[];
  // profileImage: ProfileImage | null;
}

interface AddUserGoalPayload {
  goalId: string;
  goalName: string;
  goalEmoji: string;
}

interface UpdateUserGoalNamePayload {
  goalId: string;
  newName: string;
}

interface AddInviteSentPayload {
  uid: string;
}

interface AddFriendPayload {
  uid: string;
}

interface DeleteUserGoalPayload {
  goalId: string;
}

const initialState: AuthState = {
  initializing: true,
  newlyCreated: false,
  user: null,
  uid: null,
  // profileImage: null,
  userGoals: [],
  friends: [],
  invitesSent: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateInitializing: (state, action) => {
      state.initializing = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateUid: (state, action) => {
      state.uid = action.payload;
    },
    updateNewlyCreated: (state, action) => {
      state.newlyCreated = action.payload;
    },
    updateUserGoals: (state, action) => {
      state.userGoals = action.payload;
    },
    // updateProfileImage: (state, action) => {
    //   state.profileImage = action.payload;
    // },
    addUserGoal: (state, action: PayloadAction<AddUserGoalPayload>) => {
      // for the creation of a new goal
      const newGoal = {
        id: action.payload.goalId,
        name: action.payload.goalName,
        streak: 0,
        emoji: action.payload.goalEmoji,
      };

      state.userGoals = [...state.userGoals, newGoal];
    },
    updateUserGoalName: (
      state,
      action: PayloadAction<UpdateUserGoalNamePayload>,
    ) => {
      // check if goal with this id exists
      if (
        state.userGoals.filter(g => g.id === action.payload.goalId).length === 0
      ) {
        return;
      }

      const oldGoal = state.userGoals.filter(
        g => g.id === action.payload.goalId,
      )[0];

      const newGoal = {
        id: action.payload.goalId,
        name: action.payload.newName,
        streak: oldGoal.streak,
      };

      state.userGoals = [
        ...state.userGoals.filter(g => g.id !== action.payload.goalId),
        newGoal,
      ];
    },
    deleteUserGoal: (state, action: PayloadAction<DeleteUserGoalPayload>) => {
      state.userGoals = state.userGoals.filter(
        g => g.id !== action.payload.goalId,
      );
    },
    updateInvitesSent: (state, action) => {
      state.invitesSent = action.payload;
    },
    updateFriends: (state, action) => {
      state.friends = action.payload;
    },
    addInviteSent: (state, action: PayloadAction<AddInviteSentPayload>) => {
      state.invitesSent = [...state.invitesSent, action.payload.uid];
    },
    addFriend: (state, action: PayloadAction<AddFriendPayload>) => {
      state.friends = [...state.friends, action.payload.uid];
    },
  },
});

export const {
  updateInitializing,
  updateUser,
  updateUid,
  updateNewlyCreated,
  updateUserGoals,
  // updateProfileImage,
  addUserGoal,
  updateUserGoalName,
  deleteUserGoal,
  updateFriends,
  updateInvitesSent,
  addInviteSent,
  addFriend,
} = authSlice.actions;
export const selectInitializing = (state: RootState) => state.auth.initializing;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUid = (state: RootState) => state.auth.uid;
export const selectNewlyCreated = (state: RootState) => state.auth.newlyCreated;
export const selectUserGoals = (state: RootState) => state.auth.userGoals;
// export const selectProfileImage = (state: RootState) => state.auth.profileImage;
export const selectFriends = (state: RootState) => state.auth.friends;
export const selectInvitesSent = (state: RootState) => state.auth.invitesSent;

export default authSlice.reducer;
