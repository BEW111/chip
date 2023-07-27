// Local form of a goal (not sure if this is used?)
export type Goal = {
  id: string; // actual identifier of the goal
  uid: string; // user that this goal belongs to
  name: string; // display name of the goal

  // Extra info
  description?: string;
  type?: GoalType;
  isPublic: boolean;
  emoji: string;

  // For streaks
  streakCount: number;
  streakMet: boolean;
  iterationPeriod: GoalIterationPeriod;
  iterationAmount: number;
  iterationUnits: string;
  currentIterationProgress: number;
};

// The type for the goal we upload without the id (which is generated automatically)
export type SupabaseGoalUpload = Omit<
  SupabaseGoal,
  | 'id'
  | 'created_at'
  | 'streak_count'
  | 'current_iteration_start'
  | 'current_iteration_progress'
  | 'current_iteration_streak_met'
>;

// The type for the goal we'll get from the database
export type SupabaseGoal = {
  id: string;
  created_at: string;

  uid: string; // user that this goal belongs to
  name: string; // display name of the goal

  description: string;
  type: GoalType;
  is_public: boolean;
  emoji: string;

  streak_count: number;
  iteration_period: GoalIterationPeriod;
  iteration_target: number;
  iteration_units: string;
  iteration_dows: number;
  current_iteration_start: string;
  current_iteration_progress: number;
  current_iteration_streak_met: boolean;
};
export type SupabaseGoalModification = Partial<SupabaseGoal> &
  Pick<SupabaseGoal, 'id'>;

export type GoalVisibility = 'public' | 'private';
export type GoalType = 'build' | 'break';
export type GoalIterationPeriod = 'daily' | 'weekly';
