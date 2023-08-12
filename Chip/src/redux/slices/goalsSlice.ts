import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';

import {
  SupabaseGoal,
  SupabaseGoalUpload,
  SupabaseGoalModification,
} from '../../types/goals';

const goalsSlice = supabaseApi.injectEndpoints({
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
          .eq('uid', uid)
          .order('created_at', {ascending: false});

        return {data: data, error: error?.message};
      },
    }),
    getGoalById: builder.query<SupabaseGoal | null, string>({
      providesTags: ['Goal'],
      queryFn: async (id: string) => {
        const {data, error} = await supabase
          .from('goals')
          .select()
          .eq('id', id);

        return {data: data && data[0], error: error};
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
        const {data, error} = await supabase
          .from('goals')
          .update(modification)
          .eq('id', id);

        if (error) {
          console.error('[editGoal]', error);
        }

        return {data, error: error?.message};
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
  }),
});

export const {
  useGetGoalsQuery,
  useGetGoalByIdQuery,
  useAddGoalMutation,
  useEditGoalMutation,
  useDeleteGoalMutation,
  useGetFriendGoalsQuery,
  usePrefetch,
} = goalsSlice;
