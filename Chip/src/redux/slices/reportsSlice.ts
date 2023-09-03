import {supabaseApi} from '../supabaseApi';

import {supabase} from '../../supabase/supabase';
import {ReportUserRequest, ReportStoryRequest} from '../../types/reports';

const reportsSlice = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    reportUser: builder.mutation<void, ReportUserRequest>({
      invalidatesTags: ['Reports'],
      queryFn: async (userReport: ReportUserRequest) => {
        const {error} = await supabase
          .from('reported_users')
          .insert(userReport);

        if (error) {
          return {error: error?.message};
        }
        return {data: true};
      },
    }),
    reportStory: builder.mutation<void, ReportStoryRequest>({
      invalidatesTags: ['Reports'],
      queryFn: async (storyReport: ReportStoryRequest) => {
        console.log(storyReport);
        const {error} = await supabase
          .from('reported_stories')
          .insert(storyReport);

        if (error) {
          console.log(error);
          return {error: error?.message};
        }
        return {data: true};
      },
    }),
  }),
});

export const {useReportStoryMutation, useReportUserMutation} = reportsSlice;
