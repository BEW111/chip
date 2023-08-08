// Slice for getting story info
// For controlling the current stories being viewed on the user feed, see storyFeedSlice

import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';
import {PostgrestError} from '@supabase/supabase-js';

import {
  SupabaseStoryWithViewAndCreatorResponse,
  StoryGroupsObject,
  SupabaseStoryInfo,
  StoryGroup,
} from '../../types/stories';

const storiesSlice = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    // Retrieves all stories, but grouped by users
    // And filters by only those posted less than 24 hrs ago
    getStoryGroups: builder.query<StoryGroup[] | null, void>({
      providesTags: ['Story'],
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error.message};
        }

        // Get current date 24 hrs ago
        let date = new Date();
        date.setDate(date.getDate() - 1);

        // Query the database
        // Order by latest entry
        const {
          data,
          error,
        }: {
          data: SupabaseStoryWithViewAndCreatorResponse[];
          error: PostgrestError | null;
        } = await supabase
          .from('stories')
          .select(
            '*, viewed:story_views!left(viewed), creator:creator_id(*), goal:goal_id(*)',
          )
          // .neq('creator_id', uid)
          .gt('created_at', date.toISOString())
          .order('created_at', {ascending: false});

        if (error) {
          console.error('[getStoryGroups]', error);
          return {data: [], error: error?.message};
        }

        // First, we want to group the stories by their creators
        const allStories = data.map(
          storyResult =>
            ({
              ...storyResult,
              viewed:
                storyResult.viewed.length === 0 ? false : storyResult.viewed[0],
            } as SupabaseStoryInfo),
        );

        const initStoryGroup: StoryGroupsObject = {};
        const storyGroupsObject: StoryGroupsObject = allStories.reduce(
          (groups, story) => ({
            ...groups,
            [story.creator_id]: [...(groups[story.creator_id] || []), story],
          }),
          initStoryGroup,
        );

        // Next, we want to convert to a more normalized form
        const storyGroups: StoryGroup[] = Object.entries(storyGroupsObject).map(
          ([_, stories]) => ({
            creator: stories[0].creator,
            stories: stories,
          }),
        );

        return {data: storyGroups};
      },
    }),
  }),
});

export const {useGetStoryGroupsQuery} = storiesSlice;
