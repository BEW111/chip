import {takeEvery, call, put, all, select} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';

import {
  chipSubmissionStart,
  chipSubmissionSuccess,
  chipSubmissionFailure,
  ChipSubmissionStartPayload,
} from '../slices/chipSubmitterSlice';

// Supabase
import {
  insertChipInDatabase,
  uploadChipImageToStorage,
} from '../../supabase/chips';

import {RootState} from '../store';
import {ChipSubmission, SupabaseChipUpload} from '../../types/chips';

function* submitChipSaga(action: PayloadAction<ChipSubmissionStartPayload>) {
  const chipSubmissionInfo: ChipSubmission = action.payload;

  const fileName = chipSubmissionInfo.photoUri.split('/').pop();

  if (fileName === undefined) {
    yield put(
      chipSubmissionFailure(
        `Failed to extract file name from file path ${chipSubmissionInfo.photoUri}`,
      ),
    );
    return;
  }

  const supabaseChip: SupabaseChipUpload = {
    goal_id: chipSubmissionInfo.goalId,
    photo_path: `${chipSubmissionInfo.goalId}/${fileName}`,
    amount: chipSubmissionInfo.amount,
    description: chipSubmissionInfo.description,
    uid: chipSubmissionInfo.uid,
  };

  // TODO: better error handling here--if one fails, we should undo the other
  try {
    yield all([
      call(insertChipInDatabase, supabaseChip),
      call(
        uploadChipImageToStorage,
        chipSubmissionInfo.goalId,
        chipSubmissionInfo.photoUri,
        chipSubmissionInfo.uid,
        fileName,
      ),
    ]);
    yield put(chipSubmissionSuccess());
  } catch {
    yield put(chipSubmissionFailure('Failed to insert or upload chip'));
  }

  // // First, we need to create the storage reference for when we upload the photo
  // const uid: string = action.payload.uid;
  // const goalId: string = action.payload.goalId;
  // const desc: string = action.payload.desc;
  // const amount: number = action.payload.amount;

  // // And the info we'll need for posting the story
  // const friendUids: string[] = yield select(
  //   (state: RootState) => state.auth.friends,
  // );
  // const story: StorySubmission = {
  //   image: photoReferenceInfo.photoName,
  //   message: desc,
  // };

  // try {
  //   yield all([
  //     // Upload the photo to storage, and post story after
  //     call(
  //       uploadPhotoAndStorySaga,
  //       photoReferenceInfo.reference,
  //       photoReferenceInfo.localPath,
  //       story,
  //       uid,
  //       friendUids,
  //     ),

  //     // Upload the chip data
  //     call(addChip, chip),
  //   ]);

  //   yield put(chipSubmissionSuccess());
  // } catch (error) {
  //   yield put(chipSubmissionFailure(error.message));
  // }
}

export function* watchSubmitChip() {
  // We want to use takeEvery here because a user could make multiple quick uploads in succession
  yield takeEvery(chipSubmissionStart.type, submitChipSaga);
}
