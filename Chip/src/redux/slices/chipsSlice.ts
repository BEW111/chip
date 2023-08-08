import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';
import {SupabaseChip} from '../../types/chips';

const chipsSlice = supabaseApi.injectEndpoints({
  endpoints: builder => ({
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
  }),
});

export const {
  useGetChipsQuery,
  useGetChipsByGoalIdQuery,
  useDeleteChipMutation,
} = chipsSlice;
