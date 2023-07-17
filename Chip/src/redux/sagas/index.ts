import {all, fork} from 'redux-saga/effects';
import {watchFetchStories} from './storyFeedSagas';
import {watchSubmitChip} from './chipSubmitterSagas';

export default function* rootSaga() {
  yield fork(watchFetchStories);
  yield fork(watchSubmitChip);
}
