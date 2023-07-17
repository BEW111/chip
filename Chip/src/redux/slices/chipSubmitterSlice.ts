// Handles everything related to submitting a chip, including
// taking photos, and uploading a chip (which potentially includes
// uploading it as a story)

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {PhotoSource, FlashMode} from '../../types/camera';
import {ChipSubmission} from '../../types/chips';

export const takePhoto = createAsyncThunk(
  'chipSubmitter/takePhoto',
  async payload => {
    const camera = payload.camera;
    const flash = payload.flash;
    const photo = await camera.current.takePhoto({
      flash: flash,
      qualityPrioritization: 'speed',
    });
    return photo.path;
  },
);

type ChipSubmitterState = {
  viewingPhoto: boolean;
  photoSource: PhotoSource | null; // Local path
  goal: string | null;
  flash: FlashMode;
  chipSubmissionUploading: boolean;
  chipSubmissionError: string | null;
};

const initialState: ChipSubmitterState = {
  viewingPhoto: false,
  photoSource: null,
  goal: null,
  flash: 'off',
  chipSubmissionUploading: false,
  chipSubmissionError: null,
};

export type ChipSubmissionStartPayload = ChipSubmission;

export const chipSubmitterSlice = createSlice({
  name: 'chipSubmitter',
  initialState,
  reducers: {
    updateGoal: (state, action: PayloadAction<string>) => {
      state.goal = action.payload;
    },
    toggleViewingPhoto: state => {
      state.viewingPhoto = !state.viewingPhoto;
    },
    // Saga actions
    chipSubmissionStart: (
      state,
      _action: PayloadAction<ChipSubmissionStartPayload>,
    ) => {
      state.chipSubmissionUploading = true;
      console.log('Dispatching chipSubmissionStart...');
    },
    chipSubmissionSuccess: state => {
      state.chipSubmissionUploading = false;
    },
    chipSubmissionFailure: (state, action: PayloadAction<string>) => {
      state.chipSubmissionUploading = false;
      state.chipSubmissionError = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(takePhoto.fulfilled, (state, action) => {
      state.photoSource = {
        isStatic: true,
        uri: action.payload,
      };
      state.viewingPhoto = true;
    });
  },
});

export const {
  updateGoal,
  toggleViewingPhoto,
  chipSubmissionStart,
  chipSubmissionSuccess,
  chipSubmissionFailure,
} = chipSubmitterSlice.actions;
export const selectPhotoSource = (state: RootState) =>
  state.chipSubmitter.photoSource;

export default chipSubmitterSlice.reducer;
