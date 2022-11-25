import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Goal} from '../types';

interface AuthState {
  initializing: boolean;
  newlyCreated: boolean;
  user: {} | null;
  uid: string | null;
  userGoals: Goal[];
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
  },
});

export const {
  updateInitializing,
  updateUser,
  updateUid,
  updateNewlyCreated,
  updateUserGoals,
} = authSlice.actions;
export const selectInitializing = state => state.auth.initializing;
export const selectUser = state => state.auth.user;
export const selectUid = state => state.auth.uid;
export const selectNewlyCreated = state => state.auth.newlyCreated;
export const selectUserGoals = state => state.auth.userGoals;

export default authSlice.reducer;
