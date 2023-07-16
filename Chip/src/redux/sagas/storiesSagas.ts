import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStoriesFromFirestore} from '../../firebase/stories';
import {
  fetchStoriesRequest,
  fetchStoriesSuccess,
  fetchStoriesFailure,
} from '../slices/storiesSlice';

function* fetchStoriesSaga() {
  try {
    const stories = yield call(fetchStoriesFromFirestore);
    yield put(fetchStoriesSuccess(stories));
  } catch (error) {
    yield put(fetchStoriesFailure(error.message));
  }
}

export function* watchFetchStories() {
  yield takeEvery(fetchStoriesRequest.type, fetchStoriesSaga);
}
