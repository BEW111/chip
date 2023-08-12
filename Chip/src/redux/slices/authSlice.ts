import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface AuthState {
  uid: string | null;
}

const initialState: AuthState = {
  uid: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUid: (state, action) => {
      state.uid = action.payload;
    },
  },
});

export const {updateUid} = authSlice.actions;
export const selectUid = (state: RootState) => state.auth.uid;

export default authSlice.reducer;
