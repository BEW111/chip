// Individual slices are injected in the slices folder

import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';

export const supabaseApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'Profile',
    'Goal',
    'Chip',
    'Friendship',
    'Story',
    'Costreak',
    'Block',
    'Reports',
  ],
  endpoints: builder => ({}),
});

export default supabaseApi;
