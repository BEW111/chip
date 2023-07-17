import {takeEvery, call, put} from 'redux-saga/effects';
import {fetchStoriesFromFirestore} from '../../firebase/stories';
import {
  fetchStoriesRequest,
  fetchStoriesSuccess,
  fetchStoriesFailure,
} from '../slices/storyFeedSlice';
import {FeedUserStoryGroup} from '../../types/stories';
import {PayloadAction} from '@reduxjs/toolkit';

function* fetchStoriesSaga(action: PayloadAction<string>) {
  try {
    const stories: FeedUserStoryGroup[] = yield call(
      fetchStoriesFromFirestore,
      action.payload,
    );
    yield put(fetchStoriesSuccess(stories));
  } catch (error) {
    yield put(fetchStoriesFailure(error.message));
  }
}

export function* watchFetchStories() {
  yield takeEvery(fetchStoriesRequest.type, fetchStoriesSaga);
}
