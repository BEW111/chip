import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Camera} from 'react-native-vision-camera';

export const takePhoto = createAsyncThunk(
  'actionSubmitter/takePhoto',
  async camera => {
    const photo = await camera.current.takePhoto({
      flash: 'off',
    });
    return photo.path;
  },
);

export const actionSubmitterSlice = createSlice({
  name: 'actionSubmitter',
  initialState: {
    photoSource: {},
    goal: 'none',
    viewingPhoto: false,
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

export const {updateGoal, toggleViewingPhoto} = actionSubmitterSlice.actions;
export const selectPhotoSource = state => state.actionSubmitter.photoSource;

export default actionSubmitterSlice.reducer;
