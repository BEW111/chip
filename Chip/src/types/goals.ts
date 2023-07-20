// Local form of a goal
export interface Goal {
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
}

// The type for the goal we upload without the id (which is generated automatically)
export interface SupabaseGoal {
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
}

export type GoalVisibility = 'public' | 'private';
export type GoalType = 'form' | 'break' | 'do';
export type GoalIterationPeriod = 'daily' | 'weekly';
