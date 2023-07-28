// Contains all info needed to fully submit a chip
export type ChipSubmission = {
  goalId: string;
  photoUri: string;
  amount: number;
  description: string;
  uid: string;
};

// Type for the chips we upload
export type SupabaseChipUpload = {
  goal_id: string;
  photo_path: string;
  amount: number;
  description: string;
  uid: string;
};

// Type for the chips we pull from the database
export type SupabaseChip = {
  id: string;
  created_at: string;
  goal_id: string;
  photo_path: string;
  amount: number;
  description: string;
  uid: string;
};
