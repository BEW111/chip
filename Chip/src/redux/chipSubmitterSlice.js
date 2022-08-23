import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Camera} from 'react-native-vision-camera';

export const takePhoto = createAsyncThunk(
  'chipSubmitter/takePhoto',
  async payload => {
    const camera = payload.camera;
    const flash = payload.flash;
    const photo = await camera.current.takePhoto({
      flash: flash,
    });
    return photo.path;
  },
);

export const chipSubmitterSlice = createSlice({
  name: 'chipSubmitter',
  initialState: {
    photoSource: {},
    goal: '',
    viewingPhoto: false,
    flash: 'off',
  },
  reducers: {
    updateGoal: (state, action) => {
      state.goal = action.payload;
    },
    toggleViewingPhoto: state => {
      state.viewingPhoto = !state.viewingPhoto;
    },
  },
  extraReducers: builder => {
    builder.addCase(takePhoto.fulfilled, (state, action) => {
      state.photoSource = {
        isStatic: true,
        uri: action.payload,
      };
    });
  },
});

export const {updateGoal, toggleViewingPhoto} = chipSubmitterSlice.actions;
export const selectPhotoSource = state => state.chipSubmitter.photoSource;

export default chipSubmitterSlice.reducer;
