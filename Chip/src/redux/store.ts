import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import createSagaMiddleware from 'redux-saga';

import authReducer from './slices/authSlice';
import cameraReducer from './slices/cameraSlice';
import chipSubmitterReducer from './slices/chipSubmitterSlice';
import onboardingReducer from './slices/onboardingSlice';
import analyticsReducer from './slices/analyticsSlice';
import storyFeedReducer from './slices/storyFeedSlice';
import {supabaseApi} from './supabaseApi';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    camera: cameraReducer,
    chipSubmitter: chipSubmitterReducer,
    onboarding: onboardingReducer,
    analytics: analyticsReducer,
    storyFeed: storyFeedReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
  },
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware(),
    supabaseApi.middleware,
    sagaMiddleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
sagaMiddleware.run(rootSaga);
