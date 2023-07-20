// Contains all info needed to fully submit a chip
export type ChipSubmission = {
  goalId: number;
  photoUri: string;
  amount: number;
  description: string;
  uid: string;
};

// Type of each chip in the database
export type SupabaseChip = {
  goal_id: number;
  photo_path: string;
  amount: number;
  description: string;
  uid: string;
};
