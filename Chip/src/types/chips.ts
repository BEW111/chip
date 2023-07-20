// Contains all info needed to fully submit a chip
export type ChipSubmission = {
  goalId: number;
  photoUri: string;
  amount: number;
  description: string;
  uid: string;
};

// Type for the chips we upload
export type SupabaseChipUpload = {
  goal_id: number;
  photo_path: string;
  amount: number;
  description: string;
  uid: string;
};

// Type for the chips we pull from the database
export type SupabaseChip = {
  id: number;
  created_at: string;
  goal_id: number;
  photo_path: string;
  amount: number;
  description: string;
  uid: string;
};
