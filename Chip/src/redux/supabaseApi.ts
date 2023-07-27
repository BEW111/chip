import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {supabase} from '../supabase/supabase';

import {PostgrestError} from '@supabase/supabase-js';
import {SupabaseProfile} from '../types/profiles';
import {
  SupabaseGoal,
  SupabaseGoalUpload,
  SupabaseGoalModification,
} from '../types/goals';
import {SupabaseChip} from '../types/chips';
import {
  SupabaseFriendshipResult,
  SupabaseProfileWithStatus,
  SupabaseReceivedInviteResult,
  SupabaseSentInviteResult,
} from '../types/friends';
import {
  SupabaseStoryWithViewAndCreatorResponse,
  StoryGroupsObject,
  SupabaseStoryInfo,
  StoryGroup,
} from '../types/stories';

export const supabaseApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Goal', 'Chip'],
  endpoints: builder => ({
    getCurrentProfile: builder.query<SupabaseProfile | null, void>({
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error};
        }
        const uid = userDetails.data.user.id;

        const {data, error} = await supabase
          .from('profiles')
          .select('id, updated_at, username, full_name, avatar_url')
          .eq('id', uid)
          .limit(1);

        if (data && data.length > 0) {
          const profile: Profile = data[0];
          return {data: profile};
        } else {
          return {error: error};
        }
      },
    }),
    getGoals: builder.query<SupabaseGoal[] | null, void>({
      providesTags: ['Goal'],
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error};
        }
        const uid = userDetails.data.user.id;

        const {data, error} = await supabase
          .from('goals')
          .select()
          .eq('uid', uid);

        return {data: data, error: error};
      },
    }),
    getFriendGoals: builder.query<SupabaseGoal[] | null, string>({
      providesTags: ['Goal'],
      queryFn: async (friend_uid: string) => {
        const {data, error} = await supabase
          .from('goals')
          .select()
          .eq('uid', friend_uid);

        return {data: data, error: error};
      },
    }),
    addGoal: builder.mutation<SupabaseGoal, SupabaseGoalUpload>({
      invalidatesTags: ['Goal'],
      queryFn: async (goal: SupabaseGoalUpload) => {
        const {data, error} = await supabase
          .from('goals')
          .insert(goal)
          .select();

        if (error) {
          console.error(error);
        }

        return {data: data, error: error};
      },
    }),
    editGoal: builder.mutation<SupabaseGoal, SupabaseGoalModification>({
      invalidatesTags: ['Goal'],
      queryFn: async (goalModification: SupabaseGoalModification) => {
        const {id, ...modification} = goalModification;
        const {error} = await supabase
          .from('goals')
          .update(modification)
          .eq('id', id);

        if (error) {
          console.error(error);
        }

        return {error: error};
      },
    }),
    deleteGoal: builder.mutation<void, string>({
      invalidatesTags: ['Goal'],
      queryFn: async (goalId: string) => {
        const {error} = await supabase.from('goals').delete().eq('id', goalId);

        if (error) {
          console.error(error);
        }

        return {error: error};
      },
    }),
    getChips: builder.query<SupabaseChip[] | null, void>({
      providesTags: ['Chip'],
      queryFn: async () => {
        const {data, error} = await supabase.from('chips').select();

        return {data: data, error: error};
      },
    }),
    getChipsByGoalId: builder.query<SupabaseChip[] | null, number>({
      providesTags: ['Chip'],
      queryFn: async (id: number) => {
        const {data, error} = await supabase
          .from('chips')
          .select()
          .eq('goal_id', id);

        return {data: data, error: error};
      },
    }),
    deleteChip: builder.mutation<void, string>({
      invalidatesTags: ['Chip'],
      queryFn: async (chipId: string) => {
        const {error} = await supabase.from('chips').delete().eq('id', chipId);

        if (error) {
          console.error(error);
        }

        return {error: error};
      },
    }),
    getReceivedFriendRequests: builder.query<
      SupabaseProfileWithStatus[] | null,
      void
    >({
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error};
        }
        const uid = userDetails.data.user.id;

        const {
          data,
          error,
        }: {
          data: SupabaseReceivedInviteResult[];
          error: PostgrestError | null;
        } = await supabase
          .from('friends')
          .select('sender:sender_id(*)')
          .eq('recipient_id', uid)
          .eq('status', 'pending');

        const users: SupabaseProfileWithStatus[] = data.map(result => ({
          ...result.sender,
          status: 'received',
        }));

        return {data: users, error: error};
      },
    }),
    getSentFriendRequests: builder.query<
      SupabaseProfileWithStatus[] | null,
      void
    >({
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error};
        }
        const uid = userDetails.data.user.id;

        const {
          data,
          error,
        }: {data: SupabaseSentInviteResult[]; error: PostgrestError | null} =
          await supabase
            .from('friends')
            .select('recipient:recipient_id(*)')
            .eq('sender_id', uid)
            .eq('status', 'pending');

        const users: SupabaseProfileWithStatus[] = data.map(result => ({
          ...result.recipient,
          status: 'sent',
        }));

        return {data: users, error: error};
      },
    }),
    getFriends: builder.query<SupabaseProfileWithStatus[] | null, void>({
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error};
        }
        const uid = userDetails.data.user.id;

        const {
          data,
          error,
        }: {data: SupabaseFriendshipResult[]; error: PostgrestError | null} =
          await supabase
            .from('friends')
            .select('sender:sender_id(*), recipient:recipient_id(*)')
            .eq('status', 'accepted');

        // We want to convert the data to just a list of friends (with statuses)
        // We want to get either the sender or recipient, depending on which one isn't us
        const friends: SupabaseProfileWithStatus[] = data.map(friendship =>
          friendship.recipient.id !== uid
            ? {...friendship.recipient, status: 'accepted'}
            : {...friendship.sender, status: 'accepted'},
        );

        return {data: friends, error: error};
      },
    }),
    // Retrieves all stories, but grouped by users
    getStoryGroups: builder.query<StoryGroup[] | null, void>({
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error};
        }
        const uid = userDetails.data.user.id;

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
          .select('*, viewed:story_views!left(viewed), creator:creator_id(*)')
          .neq('creator_id', uid)
          .order('created_at', {ascending: false});

        if (error) {
          console.log(error);
          return {data: [], error: error};
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

export const {
  useGetCurrentProfileQuery,
  useGetGoalsQuery,
  useAddGoalMutation,
  useEditGoalMutation,
  useDeleteGoalMutation,
  useGetChipsQuery,
  useGetChipsByGoalIdQuery,
  useDeleteChipMutation,
  useGetReceivedFriendRequestsQuery,
  useGetSentFriendRequestsQuery,
  useGetFriendsQuery,
  useGetFriendGoalsQuery,
  useGetStoryGroupsQuery,
  usePrefetch,
} = supabaseApi;
