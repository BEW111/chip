import {configureStore} from '@reduxjs/toolkit';
import chipSubmitterReducer from './chipSubmitterSlice';

export default configureStore({
  reducer: {
    chipSubmitter: chipSubmitterReducer,
  },
});
