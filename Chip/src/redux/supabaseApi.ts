import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import {supabase} from '../supabase/supabase';

import {Profile} from '../types/profiles';

export const supabaseApi = createApi({
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    getCurrentProfile: builder.query<Profile | null, string>({
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
    getProfiles: builder.query({
      queryFn: async () => {
        const {data, error} = await supabase.from('profiles').select();

        return {data: data, error: error};
      },
    }),
    getGoals: builder.query({
      queryFn: async () => {
        const {data, error} = await supabase.from('goals').select();

        return {data: data, error: error};
      },
    }),
    getChips: builder.query({
      queryFn: async () => {
        const {data, error} = await supabase.from('chips').select();

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
} = supabaseApi;
