import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';
import {BlockRequest, SupabaseBlockRequest} from '../../types/blocks';

const blocksSlice = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    /*
     * Block a particular user
     * TODO: should probably make this consistent and have the input be just a string
     */
    blockUser: builder.mutation<void, BlockRequest>({
      invalidatesTags: [
        'Goal',
        'Chip',
        'Friendship',
        'Story',
        'Costreak',
        'Block',
      ],
      queryFn: async (block: BlockRequest) => {
        const {data, error} = await supabase.from('blocks').insert({
          sender_id: block.sender_id,
          recipient_id: block.recipient_id,
        });

        if (error) {
          // This error is expected when this is a dupe block or self-block
          return {error: error?.message};
        }
        return {data: data};
      },
    }),
    /*
     * Unblock a particular user
     */
    unblockUser: builder.mutation<void, string>({
      invalidatesTags: [
        'Goal',
        'Chip',
        'Friendship',
        'Story',
        'Costreak',
        'Block',
      ],
      queryFn: async (unblock_recipient_id: string) => {
        const {data, error} = await supabase
          .from('blocks')
          .delete()
          .eq('recipient_id', unblock_recipient_id);

        if (error) {
          // This error is expected when this is a dupe block or self-block
          return {error: error?.message};
        }
        return {data: data};
      },
    }),
    // Get list of all blocked users
    getBlockedUsers: builder.query<SupabaseBlockRequest[] | null, void>({
      providesTags: ['Block'],
      queryFn: async () => {
        const {data, error} = await supabase
          .from('blocks')
          .select('id, sender_id, recipient_id');

        return {data: data, error: error?.message};
      },
    }),
  }),
});

export const {useBlockUserMutation, useUnblockUserMutation} = blocksSlice;
