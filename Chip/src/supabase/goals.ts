import {SupabaseGoal} from '../types/goals';
import {supabase} from './supabase';

export async function addGoal(goal: SupabaseGoal) {
  console.log(goal);
  const {error} = await supabase.from('goals').insert(goal);

  if (error) {
    console.error(error);
  }
}
