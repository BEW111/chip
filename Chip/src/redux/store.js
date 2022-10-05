import {configureStore} from '@reduxjs/toolkit';

import authReducer from './authSlice';
import chipSubmitterReducer from './chipSubmitterSlice';
import onboardingReducer from './onboardingSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    chipSubmitter: chipSubmitterReducer,
    onboarding: onboardingReducer,
  },
});
