import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

// These will be traversed in order
export type TutorialStage =
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
  inTutorial: false,
  stage: null,
};

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState: initialState,
  reducers: {
    startTutorial: state => {
      state.stage = 'goals-wait-start-create';
      state.inTutorial = true;
    },
    finishTutorial: state => {
      state.stage = null;
      state.inTutorial = false;
    },
    updateTutorialStage: (state, newStage: PayloadAction<TutorialStage>) => {
      state.stage = newStage.payload;
    },
  },
});

export const {updateTutorialStage, startTutorial, finishTutorial} =
  tutorialSlice.actions;
export const selectTutorialStage = (state: RootState) => state.tutorial.stage;

export default tutorialSlice.reducer;
