import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

import {Camera} from 'react-native-vision-camera';

export type CameraState = {
  takingPhoto: boolean;
  takingPhotoError: string | null;
  viewingPhoto: boolean;
  photoPath: string | null;
};

const initialState: CameraState = {
  takingPhoto: false,
  takingPhotoError: null,
  viewingPhoto: false,
  photoPath: null,
};

export type TakePhotoStartPayload = {
  camera: React.RefObject<Camera>;
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    takePhotoStart: (state, _action: PayloadAction<TakePhotoStartPayload>) => {
      state.takingPhoto = true;
    },
    takePhotoSuccess: (state, action: PayloadAction<string>) => {
      state.photoPath = action.payload;
      state.takingPhoto = false;
    },
    takePhotoFailure: (state, action: PayloadAction<string>) => {
      state.takingPhoto = false;
      state.takingPhotoError = action.payload;
      console.error(action.payload);
    },
    viewingPhotoStart: state => {
      state.viewingPhoto = true;
    },
    viewingPhotoStop: state => {
      state.viewingPhoto = false;
      state.photoPath = null;
    },
  },
});

export const {
  viewingPhotoStart,
  viewingPhotoStop,
  takePhotoStart,
  takePhotoSuccess,
  takePhotoFailure,
  testReducer,
} = cameraSlice.actions;
export const selectPhotoPath = (state: RootState) => state.camera.photoPath;
export const selectViewingPhoto = (state: RootState) =>
  state.camera.viewingPhoto;

export default cameraSlice.reducer;
