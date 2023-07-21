import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {supabase} from '../supabase/supabase';

import {SupabaseProfile} from '../types/profiles';
import {SupabaseGoal} from '../types/goals';
import {SupabaseChip} from '../types/chips';
import {
  SupabaseFriendship,
  SupabaseFriendshipResult,
  SupabaseProfileWithStatus,
  SupabaseReceivedInviteResult,
  SupabaseSentInviteResult,
} from '../types/friends';
import {PostgrestError} from '@supabase/supabase-js';

export const supabaseApi = createApi({
  baseQuery: fakeBaseQuery(),
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
      queryFn: async () => {
        const {data, error} = await supabase.from('goals').select();

        return {data: data, error: error};
      },
      staleTime: 3600000,
    }),
    getChips: builder.query<SupabaseChip[] | null, void>({
      queryFn: async () => {
        const {data, error} = await supabase.from('chips').select();

        return {data: data, error: error};
      },
    }),
    getChipsByGoalId: builder.query<SupabaseChip[] | null, number>({
      queryFn: async (id: number) => {
        const {data, error} = await supabase
          .from('chips')
          .select()
          .eq('goal_id', id);

        return {data: data, error: error};
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
            .select('recipient:sender_id(*)')
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
  }),
});

export const {
  useGetCurrentProfileQuery,
  useGetGoalsQuery,
  useGetChipsQuery,
  useGetChipsByGoalIdQuery,
  useGetReceivedFriendRequestsQuery,
  useGetSentFriendRequestsQuery,
  useGetFriendsQuery,
  usePrefetch,
} = supabaseApi;
