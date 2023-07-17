import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import authReducer from './slices/authSlice';
import chipSubmitterReducer from './slices/chipSubmitterSlice';
import onboardingReducer from './slices/onboardingSlice';
import analyticsReducer from './slices/analyticsSlice';
import storyFeedReducer from './slices/storyFeedSlice';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chipSubmitter: chipSubmitterReducer,
    onboarding: onboardingReducer,
    analytics: analyticsReducer,
    storyFeed: storyFeedReducer,
  },
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware(),
    sagaMiddleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

sagaMiddleware.run(rootSaga);
