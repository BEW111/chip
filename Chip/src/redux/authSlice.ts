import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Goal} from '../types';

interface AuthState {
  initializing: boolean;
  newlyCreated: boolean;
  user: {} | null;
  uid: string | null;
  userGoals: Goal[];
}

interface AddUserGoalPayload {
  goalId: string;
  name: string;
}

interface UpdateUserGoalNamePayload {
  goalId: string;
  newName: string;
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
        name: action.payload.name,
      };

      state.userGoals = [...state.userGoals, newGoal];
    },
    updateUserGoalName: (
      state,
      action: PayloadAction<UpdateUserGoalNamePayload>,
    ) => {
      // confirm we're updating an existing goal
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
} = authSlice.actions;
export const selectInitializing = state => state.auth.initializing;
export const selectUser = state => state.auth.user;
export const selectUid = state => state.auth.uid;
export const selectNewlyCreated = state => state.auth.newlyCreated;
export const selectUserGoals = state => state.auth.userGoals;

export default authSlice.reducer;
