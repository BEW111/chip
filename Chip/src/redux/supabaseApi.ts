import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {supabase} from '../supabase/supabase';

import {Profile} from '../types/profiles';
import {SupabaseGoal} from '../types/goals';
import {SupabaseChip} from '../types/chips';

export const supabaseApi = createApi({
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    getCurrentProfile: builder.query<Profile | null, void>({
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();

        if (userDetails.error) {
          return {error: userDetails.error};
        }

        const {data, error} = await supabase
          .from('profiles')
          .select('id, updated_at, username, full_name, avatar_url')
          .eq('id', userDetails.data.user.id)
          .limit(1);

        if (data && data.length > 0) {
          const profile: Profile = data[0];
          return {data: profile};
        } else {
          return {error: error};
        }
      },
    }),
    getProfiles: builder.query<Profile[] | null, void>({
      queryFn: async () => {
        const {data, error} = await supabase.from('profiles').select();

        return {data: data, error: error};
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
  }),
});

export const {
  useGetProfilesQuery,
  useGetCurrentProfileQuery,
  useGetGoalsQuery,
  useGetChipsQuery,
  useGetChipsByGoalIdQuery,
  usePrefetch,
} = supabaseApi;
