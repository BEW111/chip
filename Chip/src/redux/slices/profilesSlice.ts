import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';
import {SupabaseProfile} from '../../types/profiles';

export const extendedApiSlice = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getCurrentProfile: builder.query<SupabaseProfile | null, void>({
      providesTags: ['Profile'],
      queryFn: async () => {
        const userDetails = await supabase.auth.getUser();
        if (userDetails.error) {
          return {error: userDetails.error.message};
        }
        const uid = userDetails.data.user.id;

        const {data, error} = await supabase
          .from('profiles')
          .select('id, updated_at, username, full_name, avatar_url')
          .eq('id', uid)
          .limit(1);

        if (data && data.length > 0) {
          const profile: SupabaseProfile = data[0];
          return {data: profile};
        } else {
          return {error: error?.message};
        }
      },
    }),
  }),
});

export const {useGetCurrentProfileQuery} = extendedApiSlice;
