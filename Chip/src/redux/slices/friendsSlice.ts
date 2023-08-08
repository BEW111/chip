import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';
import {PostgrestError} from '@supabase/supabase-js';

import {
  SupabaseFriendshipResult,
  SupabaseProfileWithFriendship,
  SupabaseReceivedInviteResult,
  SupabaseSentInviteResult,
} from '../../types/friends';

const friendsSlice = supabaseApi.injectEndpoints({
  endpoints: builder => ({
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
  }),
});

export const {
  useGetReceivedFriendRequestsQuery,
  useGetSentFriendRequestsQuery,
  useGetFriendsQuery,
} = friendsSlice;
