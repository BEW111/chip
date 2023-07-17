import {PhotoSource} from './camera';

export type ChipSubmission = {
  photoSource: PhotoSource;
  goalId: string;
  desc: string;
  uid: string;
  amount: number;
};
