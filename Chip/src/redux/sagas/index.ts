import {fork} from 'redux-saga/effects';
import {watchSubmitChip} from './chipSubmitterSagas';

export default function* rootSaga() {
  yield fork(watchSubmitChip);
}
