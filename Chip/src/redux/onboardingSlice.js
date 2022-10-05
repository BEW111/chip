import {createSlice} from '@reduxjs/toolkit';

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    newGoal: '',
  },
  reducers: {
    updateNewGoal: (state, action) => {
      state.newGoal = action.payload;
    },
  },
});

export const {updateNewGoal} = onboardingSlice.actions;
export const selectNewGoal = state => state.onboarding.newGoal;

export default onboardingSlice.reducer;
