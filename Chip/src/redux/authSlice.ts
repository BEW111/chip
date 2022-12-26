import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Goal} from '../types';
import {RootState} from './store';

interface AuthState {
  initializing: boolean;
  newlyCreated: boolean;
  user: {} | null;
  uid: string | null;
  userGoals: Goal[];
  friends: string[];
  invitesSent: string[];
}

interface AddUserGoalPayload {
  goalId: string;
  goalName: string;
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
    addUserGoal: (state, action: PayloadAction<AddUserGoalPayload>) => {
      const newGoal = {
        id: action.payload.goalId,
        name: action.payload.goalName,
      };

      state.userGoals = [...state.userGoals, newGoal];
    },
    updateUserGoalName: (
      state,
      action: PayloadAction<UpdateUserGoalNamePayload>,
    ) => {
      if (
        state.userGoals.filter(g => g.id === action.payload.goalId).length === 0
      ) {
        return;
      }

      const newGoal = {
        id: action.payload.goalId,
        name: action.payload.newName,
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
export const selectFriends = (state: RootState) => state.auth.friends;
export const selectInvitesSent = (state: RootState) => state.auth.invitesSent;

export default authSlice.reducer;
