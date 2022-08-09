import {configureStore} from '@reduxjs/toolkit';
import actionSubmitterReducer from './actionSubmitterSlice';

export default configureStore({
  reducer: {
    actionSubmitter: actionSubmitterReducer,
  },
});
