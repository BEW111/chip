import {createSlice} from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    initializing: true,
    newlyCreated: false,
    user: null,
    uid: null,
  },
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
  },
});

export const {updateInitializing, updateUser, updateUid, updateNewlyCreated} =
  authSlice.actions;
export const selectInitializing = state => state.auth.initializing;
export const selectUser = state => state.auth.user;
export const selectUid = state => state.auth.uid;
export const selectNewlyCreated = state => state.auth.newlyCreated;

export default authSlice.reducer;
