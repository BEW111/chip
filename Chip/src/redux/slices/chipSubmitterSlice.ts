// Handles everything related to submitting a chip, including
// uploading it as a story

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ChipSubmission} from '../../types/chips';

type ChipSubmitterState = {
  goal: string | null;

  chipSubmissionUploading: boolean;
  chipSubmissionError: string | null;
};

const initialState: ChipSubmitterState = {
  goal: null,

  chipSubmissionUploading: false,
  chipSubmissionError: null,
};

export type ChipSubmissionStartPayload = ChipSubmission;

export const chipSubmitterSlice = createSlice({
  name: 'chipSubmitter',
  initialState,
  reducers: {
    // Saga actions
    chipSubmissionStart: (
      state,
      _action: PayloadAction<ChipSubmissionStartPayload>,
    ) => {
      state.chipSubmissionUploading = true;
    },
    chipSubmissionSuccess: state => {
      state.chipSubmissionUploading = false;
    },
    chipSubmissionFailure: (state, action: PayloadAction<string>) => {
      state.chipSubmissionUploading = false;
      state.chipSubmissionError = action.payload;
      console.error('[chipSubmissionFailure]', action.payload);
    },
  },
});

export const {
  chipSubmissionStart,
  chipSubmissionSuccess,
  chipSubmissionFailure,
} = chipSubmitterSlice.actions;

export default chipSubmitterSlice.reducer;
