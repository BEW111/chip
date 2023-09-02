import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';
import {BlockRequest} from '../../types/blocks';

const blocksSlice = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    /*
     * Block a particular user
     */
    blockUser: builder.mutation<void, BlockRequest>({
      invalidatesTags: ['Goal', 'Chip', 'Friendship', 'Story', 'Costreak'],
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
  }),
});

export const {useBlockUserMutation} = blocksSlice;
