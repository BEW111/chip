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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
