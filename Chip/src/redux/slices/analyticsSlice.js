import {createSlice} from '@reduxjs/toolkit';

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    selectedGoal: '',
  },
  reducers: {
    updateSelectedGoal: (state, action) => {
      state.selectedGoal = action.payload;
    },
  },
});

export const {updateSelectedGoal} = analyticsSlice.actions;
export const selectSelectedGoal = state => state.analytics.selectedGoal;

export default analyticsSlice.reducer;
