// Local form of a goal
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
export type SupabaseGoalUpload = {
  uid: string; // user that this goal belongs to
  name: string; // display name of the goal

  description?: string;
  type?: GoalType;
  is_public: boolean;
  emoji: string;

  streak_count: number;
  streak_met: boolean;
  iteration_period: GoalIterationPeriod;
  iteration_amount: number;
  iteration_units: string;
  current_iteration_progress: number;
};

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
  streak_met: boolean;
  iteration_period: GoalIterationPeriod;
  iteration_amount: number;
  iteration_units: string;
  current_iteration_progress: number;
};
export type SupabaseGoalModification = Partial<SupabaseGoal> &
  Pick<SupabaseGoal, 'id'>;

export type GoalVisibility = 'public' | 'private';
export type GoalType = 'build' | 'break';
export type GoalIterationPeriod = 'daily' | 'weekly';
