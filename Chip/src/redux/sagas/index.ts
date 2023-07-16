import {all, fork} from 'redux-saga/effects';
import {watchFetchStories} from './storiesSagas';

export default function* rootSaga() {
  yield all([fork(watchFetchStories)]);
}
