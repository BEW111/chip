import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

type TutorialStage =
  | null
  | 'goals-wait-start-create'
  | 'goals-entering-name'
  | 'goals-entering-emoji'
  | 'goals-entering-privacy'
  | 'goals-entering-units'
  | 'goals-entering-schedule'
  | 'goals-entering-done'
  | 'track-wait-take-photo'
  | 'track-entering-chip-info'
  | 'track-entering-chip-done'
  | 'friends-wait-add';

type TutorialState = {
  inTutorial: boolean;
  stage: TutorialStage;
};

const initialState: TutorialState = {
  inTutorial: true,
  stage: 'goals-wait-start-create',
};

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState: initialState,
  reducers: {
    updateTutorialStage: (state, newStage: PayloadAction<TutorialStage>) => {
      state.stage = newStage.payload;
    },
  },
});

export const {updateTutorialStage} = tutorialSlice.actions;
export const selectTutorialStage = (state: RootState) => state.tutorial.stage;

export default tutorialSlice.reducer;
