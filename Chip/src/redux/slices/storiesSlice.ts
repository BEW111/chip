import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

import {UserStoryGroup} from '../../types/stories';

// We assume that based on the way we have implemented the functionality
// for adding the stories, that the users are sorted in reverse order
// of the last story added
type StoriesState = {
  userStoryGroups: UserStoryGroup[];
  storiesLoading: boolean;
  storiesError: string | null;
  currentUserViewing: string | null;
};

const initialState: StoriesState = {
  userStoryGroups: [],
  storiesLoading: false,
  storiesError: null,
  currentUserViewing: null, // the current user for the stories we're viewing right now
};

// Payloads
type FetchStoriesSuccessPayload = UserStoryGroup[];

export const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    // Note that the current story we're viewing is ALWAYS the last element
    // of our unviewedStoriesIndices array
    markAsViewed: (state, action: PayloadAction<string>) => {
      const userIndex = state.userStoryGroups.findIndex(
        storyGroup => storyGroup.user === action.payload,
      );
      if (userIndex === -1) {
        throw Error;
      }
      state.userStoryGroups[userIndex].unviewedStoriesIndices.pop();
    },
    setCurrentUserViewing: (state, action: PayloadAction<string>) => {
      state.currentUserViewing = action.payload;
    },
    fetchStoriesRequest: state => {
      state.storiesLoading = true;
    },
    fetchStoriesSuccess: (
      state,
      action: PayloadAction<FetchStoriesSuccessPayload>,
    ) => {
      state.userStoryGroups = action.payload;
      state.storiesError = null;
      state.storiesLoading = false;
    },
    fetchStoriesFailure: (state, action: PayloadAction<string>) => {
      state.storiesError = action.payload;
      state.storiesLoading = false;
    },
  },
});

export const {
  markAsViewed,
  setCurrentUserViewing,
  fetchStoriesRequest,
  fetchStoriesSuccess,
  fetchStoriesFailure,
} = storiesSlice.actions;
export const selectAllStoryGroups = (state: RootState) =>
  state.stories.userStoryGroups;
export const selectCurrentUserViewing = (state: RootState) =>
  state.stories.currentUserViewing;
export const selectCurrentStoryViewing = (state: RootState) => {
  const userStories = state.stories.userStoryGroups.find(
    storyGroup => state.stories.currentUserViewing === storyGroup.user,
  );
  return userStories?.stories[userStories?.unviewedStoriesIndices[-1]];
};

export default storiesSlice.reducer;
