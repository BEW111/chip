export interface SupabaseReminder {
  id: string;
  created_at: string;

  goal_id: string;
  notification_intent: 'none' | 'remind' | 'prepare' | 'now';
  time_sent: string;
}
