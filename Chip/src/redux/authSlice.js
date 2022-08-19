import {createSlice} from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    initializing: true,
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
  },
});

export const {updateInitializing, updateUser, updateUid} = authSlice.actions;
export const selectInitializing = state => state.auth.initializing;
export const selectUser = state => state.auth.user;
export const selectUid = state => state.auth.uid;

export default authSlice.reducer;
