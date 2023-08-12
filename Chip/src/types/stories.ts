import {SupabaseGoal} from './goals';
import {SupabaseProfile} from './profiles';

// The data for an ordinary story posted by a user
export type SupabaseStoryUpload = {
  creator_id: string;
  photo_path: string;
  message: string;
  goal_id: string;
};

export type SupabaseStory = {
  id: string;
  created_at: string;
  creator_id: string;
  photo_path: string;
  message: string;
};

// We have a trigger to automatically add a "story view" row to the story views table
// every time a story is added. If this row exists, it means that story {story_id} was
// viewed by viewer {viewer_id}.
export type SupabaseStoryViewUpload = {
  story_id: string;
  poster_id: string;
  viewer_id: string;
};

export type SupabaseStoryView = {
  id: string;
  created_at: string;
  story_id: string;
  poster_id: string;
  viewer_id: string;
};

// These are the actual objects we want to be dealing with, containing a creator
// and an array of their stories
export type Story = {
  id: string;
  created_at: string;
  creator_id: string;
  photo_path: string;
  message: string;
  viewed: boolean;
  goal: SupabaseGoal;
};

export type StoryGroup = {
  creator: SupabaseProfile;
  stories: Story[];
};

// These are temporary response types that we should convert to a better form when possible
export type SupabaseStoryWithViewAndCreatorResponse = {
  id: string;
  created_at: string;
  creator_id: string;
  creator: SupabaseProfile;
  photo_path: string;
  message: string;
  viewed: boolean[];
  goal: SupabaseGoal;
};

export type SupabaseStoryInfo = {
  id: string;
  created_at: string;
  creator: SupabaseProfile;
  creator_id: string;
  photo_path: string;
  message: string;
  viewed: boolean;
  goal: SupabaseGoal;
};

export type StoryGroupsObject = {
  [poster_id: string]: SupabaseStoryInfo[];
};
