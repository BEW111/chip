import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface AuthState {
  uid: string | null;

  initializing: boolean;
  newlyCreated: boolean;
}

const initialState: AuthState = {
  uid: null,

  initializing: true,
  newlyCreated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUid: (state, action) => {
      state.uid = action.payload;
    },
    updateInitializing: (state, action) => {
      state.initializing = action.payload;
    },
  },
});

export const {updateInitializing, updateUid} = authSlice.actions;
export const selectUid = (state: RootState) => state.auth.uid;
export const selectInitializing = (state: RootState) => state.auth.initializing;
export const selectNewlyCreated = (state: RootState) => state.auth.newlyCreated;

export default authSlice.reducer;
