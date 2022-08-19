import {configureStore} from '@reduxjs/toolkit';

import authReducer from './authSlice';
import chipSubmitterReducer from './chipSubmitterSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    chipSubmitter: chipSubmitterReducer,
  },
});
