export type SupabaseCostreak = {
  id: string;
  created_at: string;

  friendship_id: string;
  sender_id: string;
  recipient_id: string;
  status: string;

  sender_goal_id: string;
  recipient_goal_id: string;

  streak_count: number;
  current_iteration_streak_met: boolean;
};

export type SupabaseCostreakUpload = Omit<
  SupabaseCostreak,
  | 'id'
  | 'created_at'
  | 'status'
  | 'streak_count'
  | 'current_iteration_streak_met'
>;
