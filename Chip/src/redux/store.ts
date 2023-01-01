import {configureStore} from '@reduxjs/toolkit';

import authReducer from './authSlice';
import chipSubmitterReducer from './chipSubmitterSlice';
import onboardingReducer from './onboardingSlice';
import analyticsReducer from './analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chipSubmitter: chipSubmitterReducer,
    onboarding: onboardingReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
