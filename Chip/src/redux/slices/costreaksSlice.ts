// Slice for getting story info
// For controlling the current stories being viewed on the user feed, see storyFeedSlice

import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';
import {
  SupabaseCostreak,
  SupabaseCostreakDetailed,
  SupabaseCostreakUpload,
} from '../../types/costreaks';

const costreaksSlice = supabaseApi.injectEndpoints({
  endpoints: builder => ({
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
  useGetFriendCostreaksQuery,
  useGetGoalCostreaksQuery,
  useAddCostreakMutation,
  useAcceptCostreakMutation,
} = costreaksSlice;
