import {takeEvery, call, put, all, select} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';

import {
  chipSubmissionStart,
  chipSubmissionSuccess,
  chipSubmissionFailure,
  ChipSubmissionStartPayload,
} from '../slices/chipSubmitterSlice';
import {
  createPhotoStorageReference,
  uploadChipPhoto,
  uploadChip,
} from '../../firebase/chips';
import {postStory} from '../../firebase/stories';

import {RootState} from '../store';
import {StorySubmission} from '../../types/stories';
import {PhotoSource} from '../../types/camera';
import {FirebaseStorageTypes} from '@react-native-firebase/storage';

function* uploadPhotoAndStorySaga(
  photoReference: FirebaseStorageTypes.Reference,
  photoLocalPath: string,
  story: StorySubmission,
  uid: string,
  friendUids: string[],
) {
  yield call(uploadChipPhoto, photoReference, photoLocalPath);
  yield call(postStory, story, uid, friendUids);
}

function* submitChipSaga(action: PayloadAction<ChipSubmissionStartPayload>) {
  // First, we need to create the storage reference for when we upload the photo
  const uid: string = action.payload.uid;
  const photoSource: PhotoSource = action.payload.photoSource;
  const photoReferenceInfo = createPhotoStorageReference(photoSource, uid);

  // Let's get all of the relevant info we need
  const goalId: string = action.payload.goalId;
  const desc: string = action.payload.desc;
  const amount: number = action.payload.amount;

  // And the info we'll need for posting the story
  const friendUids: string[] = yield select(
    (state: RootState) => state.auth.friends,
  );
  const story: StorySubmission = {
    image: photoReferenceInfo.photoName,
    message: desc,
  };

  try {
    yield all([
      // Upload the photo to storage, and post story after
      call(
        uploadPhotoAndStorySaga,
        photoReferenceInfo.reference,
        photoReferenceInfo.localPath,
        story,
        uid,
        friendUids,
      ),

      // Upload the chip data
      call(uploadChip, goalId, desc, uid, amount, photoReferenceInfo.photoName),
    ]);

    yield put(chipSubmissionSuccess());
  } catch (error) {
    yield put(chipSubmissionFailure(error.message));
  }
}

export function* watchSubmitChip() {
  // We want to use takeEvery here because a user could make multiple quick uploads in succession
  yield takeEvery(chipSubmissionStart.type, submitChipSaga);
}
