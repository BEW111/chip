import {SupabaseStoryUpload, SupabaseStoryViewUpload} from '../types/stories';
import {supabase} from './supabase';

// Pushes story to the database
export async function insertStoryInDatabase(story: SupabaseStoryUpload) {
  const {error} = await supabase.from('stories').insert(story);

  if (error) {
    console.error(error);
  }
}

export async function insertStoryView(storyView: SupabaseStoryViewUpload) {
  const {error} = await supabase.from('story_views').insert(storyView);

  if (error) {
    console.error(error);
  }
}
