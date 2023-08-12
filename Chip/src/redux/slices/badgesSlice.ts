import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface BadgesState {
  goalBadgeEnabled: boolean;
}

const initialState: BadgesState = {
  goalBadgeEnabled: false,
};

export const badgesSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    badgeChangeFromPostChip: state => {
      state.goalBadgeEnabled = true;
    },
    badgeChangeFromViewGoals: state => {
      state.goalBadgeEnabled = false;
    },
  },
});

export const {badgeChangeFromPostChip, badgeChangeFromViewGoals} =
  badgesSlice.actions;
export const selectGoalBadgeEnabled = (state: RootState) =>
  state.badges.goalBadgeEnabled;

export default badgesSlice.reducer;
