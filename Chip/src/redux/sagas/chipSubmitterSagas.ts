import {takeEvery, call, put, all} from 'redux-saga/effects';
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
import {insertStoryInDatabase} from '../../supabase/stories';
import {ChipSubmission, SupabaseChipUpload} from '../../types/chips';
import {SupabaseStoryUpload} from '../../types/stories';

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

  const supabaseStory: SupabaseStoryUpload = {
    creator_id: chipSubmissionInfo.uid,
    photo_path: `${chipSubmissionInfo.uid}/${chipSubmissionInfo.goalId}/${fileName}`,
    message: chipSubmissionInfo.description, // <-- TODO: change this later to a custom message
    goal_id: chipSubmissionInfo.goalId,
  };

  // TODO: better error handling here--if one fails, we should undo the other
  try {
    yield all([
      call(insertChipInDatabase, supabaseChip),
      call(insertStoryInDatabase, supabaseStory),
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
}

export function* watchSubmitChip() {
  // We want to use takeEvery here because a user could make multiple quick uploads in succession
  yield takeEvery(chipSubmissionStart.type, submitChipSaga);
}
