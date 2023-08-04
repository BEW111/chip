import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {supabase} from '../supabase/supabase';

import {PostgrestError} from '@supabase/supabase-js';
import {
  SupabaseGoal,
  SupabaseGoalUpload,
  SupabaseGoalModification,
} from '../types/goals';
import {SupabaseChip} from '../types/chips';
import {
  SupabaseFriendshipResult,
  SupabaseProfileWithFriendship,
  SupabaseReceivedInviteResult,
  SupabaseSentInviteResult,
} from '../types/friends';
import {
  SupabaseStoryWithViewAndCreatorResponse,
  StoryGroupsObject,
  SupabaseStoryInfo,
  StoryGroup,
} from '../types/stories';
import {
  SupabaseCostreak,
  SupabaseCostreakDetailed,
  SupabaseCostreakUpload,
} from '../types/costreaks';

export const supabaseApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Profile', 'Goal', 'Chip', 'Friendship', 'Story', 'Costreak'],
  endpoints: builder => ({
    getGoals: builder.query<SupabaseGoal[] | null, void>({
      providesTags: ['Goal'],
      queryFn: async () => {
        console.log('[getGoals] fetching...');
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          console.log('[getGoals] error');
          console.log('[getGoals]', userDetails);
          return {error: userDetails.error.message};
        }
        const uid = userDetails.data.user.id;

        const {data, error} = await supabase
          .from('goals')
          .select()
          .eq('uid', uid);

        return {data: data, error: error?.message};
      },
    }),
    getFriendGoals: builder.query<SupabaseGoal[] | null, string>({
      providesTags: ['Goal'],
      queryFn: async (friend_uid: string) => {
        const {data, error} = await supabase
          .from('goals')
          .select()
          .eq('uid', friend_uid);

        return {data: data, error: error?.message};
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
          console.error('[addGoal]', error);
        }

        return {data: data, error: error?.message};
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
          console.error('[editGoal]', error);
        }

        return {error: error?.message};
      },
    }),
    deleteGoal: builder.mutation<void, string>({
      invalidatesTags: ['Goal'],
      queryFn: async (goalId: string) => {
        const {data, error} = await supabase
          .from('goals')
          .delete()
          .eq('id', goalId);

        if (error) {
          console.error('[deleteGoal]', error);
        }

        return {data: 'Success', error: error?.message};
      },
    }),
    getChips: builder.query<SupabaseChip[] | null, void>({
      providesTags: ['Chip'],
      queryFn: async () => {
        console.log('[getChips] fetching...');
        const {data, error} = await supabase.from('chips').select();
        console.log('[getChips] error:', error);

        return {data: data, error: error?.message};
      },
    }),
    getChipsByGoalId: builder.query<SupabaseChip[] | null, number>({
      providesTags: ['Chip'],
      queryFn: async (id: number) => {
        const {data, error} = await supabase
          .from('chips')
          .select()
          .eq('goal_id', id);

        return {data: data, error: error?.message};
      },
    }),
    deleteChip: builder.mutation<void, string>({
      invalidatesTags: ['Chip'],
      queryFn: async (chipId: string) => {
        const {error} = await supabase.from('chips').delete().eq('id', chipId);

        if (error) {
          console.error('[deleteChip]', error);
        }

        return {error: error?.message};
      },
    }),
    getReceivedFriendRequests: builder.query<
      SupabaseProfileWithFriendship[] | null,
      void
    >({
      providesTags: ['Friendship'],
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error.message};
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
          .select('sender:sender_id(*), id')
          .eq('recipient_id', uid)
          .eq('status', 'pending');

        const users: SupabaseProfileWithFriendship[] = data.map(result => ({
          ...result.sender,
          friendship_id: result.id,
          status: 'received',
        }));

        return {data: users, error: error?.message};
      },
    }),
    getSentFriendRequests: builder.query<
      SupabaseProfileWithFriendship[] | null,
      void
    >({
      providesTags: ['Friendship'],
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error.message};
        }
        const uid = userDetails.data.user.id;

        const {
          data,
          error,
        }: {data: SupabaseSentInviteResult[]; error: PostgrestError | null} =
          await supabase
            .from('friends')
            .select('recipient:recipient_id(*), id')
            .eq('sender_id', uid)
            .eq('status', 'pending');

        const users: SupabaseProfileWithFriendship[] = data.map(result => ({
          ...result.recipient,
          friendship_id: result.id,
          status: 'sent',
        }));

        return {data: users, error: error?.message};
      },
    }),
    getFriends: builder.query<SupabaseProfileWithFriendship[] | null, void>({
      providesTags: ['Friendship'],
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error.message};
        }
        const uid = userDetails.data.user.id;

        if (!uid) {
          return {data: null, error: null};
        }

        const {
          data,
          error,
        }: {data: SupabaseFriendshipResult[]; error: PostgrestError | null} =
          await supabase
            .from('friends')
            .select('sender:sender_id(*), recipient:recipient_id(*), id')
            .eq('status', 'accepted');

        // We want to convert the data to just a list of friends (with statuses)
        // We want to get either the sender or recipient, depending on which one isn't us
        const friends: SupabaseProfileWithFriendship[] = data.map(friendship =>
          friendship.recipient.id !== uid
            ? {
                ...friendship.recipient,
                friendship_id: friendship.id,
                status: 'accepted',
              }
            : {
                ...friendship.sender,
                friendship_id: friendship.id,
                status: 'accepted',
              },
        );

        return {data: friends, error: error?.message};
      },
    }),
    // Retrieves all stories, but grouped by users
    getStoryGroups: builder.query<StoryGroup[] | null, void>({
      providesTags: ['Story'],
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error.message};
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
          .select(
            '*, viewed:story_views!left(viewed), creator:creator_id(*), goal:goal_id(*)',
          )
          // .neq('creator_id', uid)
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
    getFriendCostreaks: builder.query<
      SupabaseCostreakDetailed[] | null,
      string
    >({
      providesTags: ['Costreak'],
      queryFn: async (friend_uid: string) => {
        const {data, error} = await supabase
          .from('costreaks')
          .select(
            '*, sender_goal_name:sender_goal_id(name), recipient_goal_name:recipient_goal_id(name)',
          )
          .or(`sender_id.eq.${friend_uid}, recipient_id.eq.${friend_uid}`);

        if (data) {
          const costreaksFormatted = data.map(costreak => ({
            ...costreak,
            sender_goal_name: costreak.sender_goal_name.name,
            recipient_goal_name: costreak.recipient_goal_name.name,
          }));

          return {data: costreaksFormatted};
        }

        return {data: data, error: error?.message};
      },
    }),
    getGoalCostreaks: builder.query<SupabaseCostreakWithUsers[] | null, string>(
      {
        providesTags: ['Goal', 'Costreak'],
        queryFn: async (goal_id: string) => {
          const {data, error} = await supabase
            .from('costreaks')
            .select('*, sender:sender_id(*), recipient:recipient_id(*)')
            .or(
              `sender_goal_id.eq.${goal_id}, recipient_goal_id.eq.${goal_id}`,
            );

          return {data: data, error: error?.message};
        },
      },
    ),
    addCostreak: builder.mutation<SupabaseCostreak, SupabaseCostreakUpload>({
      invalidatesTags: ['Costreak'],
      queryFn: async (costreakInvite: SupabaseCostreakUpload) => {
        const {data, error} = await supabase
          .from('costreaks')
          .insert(costreakInvite)
          .select();

        if (error) {
          console.error('[addCostreak]', error);
        }

        return {data: data, error: error?.message};
      },
    }),
    acceptCostreak: builder.mutation<SupabaseCostreak, string>({
      invalidatesTags: ['Costreak'],
      queryFn: async (id: string) => {
        const {data, error} = await supabase
          .from('costreaks')
          .update({status: 'accepted'})
          .eq('id', id);

        if (error) {
          console.error('[acceptCostreak]', error);
        }

        return {data: data, error: error?.message};
      },
    }),
  }),
});

export const {
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
  useGetFriendCostreaksQuery,
  useGetGoalCostreaksQuery,
  useAddCostreakMutation,
  useAcceptCostreakMutation,
  usePrefetch,
} = supabaseApi;
export default supabaseApi;
