// Slice for stories
// Note that each user will have a group of stories, so we keep track
// of which user we're viewing stories for, and which stories we're actually viewing

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
  currentUserViewingIdx: number | null;
  currentStoryViewingIdx: number | null;
  justViewedNewStory: boolean;
};

const initialState: StoriesState = {
  userStoryGroups: [],
  storiesLoading: false,
  storiesError: null,
  currentUserViewingIdx: null, // the current user for the stories we're viewing right now
  currentStoryViewingIdx: null, // the current story we're viewing, by index
  justViewedNewStory: false,
};

// Payloads
type ViewStoryByUserIdxPayload = number;
type FetchStoriesSuccessPayload = UserStoryGroup[];

export const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    // We want to find the first story of this user that hasn't been viewed,
    // if it exists, but otherwise just return the first story
    viewStoryByUserIdx: (
      state,
      action: PayloadAction<ViewStoryByUserIdxPayload>,
    ) => {
      // Finds the next unviewed story for a certain user
      // Returns 0 if all have been viewed
      const storyIdx = state.userStoryGroups[action.payload].stories.findIndex(
        story => !story.viewed,
      );

      // We've already viewed all stories for this user, so just return the first one
      if (storyIdx === -1) {
        state.currentUserViewingIdx = action.payload;
        state.currentStoryViewingIdx = 0;
        state.justViewedNewStory = false;
      } else {
        // We haven't viewed a certain story yet, so change to it and mark as viewed
        state.currentUserViewingIdx = action.payload;
        state.currentStoryViewingIdx = storyIdx;
        state.userStoryGroups[action.payload].stories[storyIdx].viewed = true;
        state.justViewedNewStory = true;
      }
    },
    // A user moves to the next story that should be viewed
    // If we just viewed a new story, we should look for the next unviewed story,
    // but if we just viewed an old story, we should just look for the next story in general
    viewNextStory: state => {
      // This function shouldn't be used when either of these are null
      if (
        state.currentStoryViewingIdx == null ||
        state.currentUserViewingIdx == null
      ) {
        return;
      }

      // Helper function to find the next story, even if it has already
      // been viewed
      const findNextStory = (userIdx: number, storyIdx: number) => {
        const currentStories = state.userStoryGroups[userIdx].stories;

        // Last user, last story
        if (
          userIdx === state.userStoryGroups.length - 1 &&
          storyIdx === currentStories.length - 1
        ) {
          return {nextUserIdx: null, nextStoryIdx: null};
        }

        // Last user, but not last story
        if (
          userIdx === state.userStoryGroups.length - 1 &&
          storyIdx < currentStories.length - 1
        ) {
          return {nextUserIdx: userIdx, nextStoryIdx: storyIdx + 1};
        }

        // Not last user, but last story
        if (
          userIdx < state.userStoryGroups.length - 1 &&
          storyIdx === currentStories.length - 1
        ) {
          return {nextUserIdx: userIdx + 1, nextStoryIdx: 0};
        }

        // Not last user, not last story either
        return {nextUserIdx: userIdx, nextStoryIdx: storyIdx + 1};
      };

      // Helper function to find the next unviewed story, starting from the
      // indexes for a current user and story. Note that this helper function does
      // not mutate state.
      const findNextUnviewedStory = (userIdx: number, storyIdx: number) => {
        let nextUserIdx = userIdx;
        let nextStoryIdx = storyIdx + 1;

        while (nextUserIdx <= state.userStoryGroups.length - 1) {
          // Check if there is another story for this user
          while (
            nextStoryIdx <=
            state.userStoryGroups[nextUserIdx].stories.length - 1
          ) {
            // If the story isn't viewed, then we can return it
            if (
              !state.userStoryGroups[nextUserIdx].stories[nextStoryIdx].viewed
            ) {
              return {nextUserIdx, nextStoryIdx};
            }

            // Otherwise, try going to the next story
            nextStoryIdx += 1;
          }

          // If this user does not have any, then we need to move to the next one
          nextUserIdx += 1;
          nextStoryIdx = 0;
        }

        return {nextUserIdx: null, nextStoryIdx: null};
      };

      // Update state (will automatically update to null if nothing is left)
      // If we just viewed a new (unviewed) story, then we should get the next unviewed story
      const findNextStoryFunction = state.justViewedNewStory
        ? findNextUnviewedStory
        : findNextStory;

      const {nextUserIdx, nextStoryIdx} = findNextStoryFunction(
        state.currentUserViewingIdx,
        state.currentStoryViewingIdx,
      );

      state.currentUserViewingIdx = nextUserIdx;
      state.currentStoryViewingIdx = nextStoryIdx;

      if (nextUserIdx !== null && nextStoryIdx !== null) {
        // Mark story as viewed
        state.userStoryGroups[nextUserIdx].stories[nextStoryIdx].viewed = true;
      } else {
        // Need to reset this if we finished reading
        state.justViewedNewStory = false;
      }
    },
    stopViewingStory: state => {
      state.currentUserViewingIdx = null;
      state.currentStoryViewingIdx = null;
      state.justViewedNewStory = false;
    },
    // Saga actions
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
  viewStoryByUserIdx,
  viewNextStory,
  stopViewingStory,
  fetchStoriesRequest,
  fetchStoriesSuccess,
  fetchStoriesFailure,
} = storiesSlice.actions;
export const selectAllStoryGroups = (state: RootState) =>
  state.stories.userStoryGroups;
export const selectCurrentUserViewingIdx = (state: RootState) =>
  state.stories.currentUserViewingIdx;
export const selectCurrentStoryViewingIdx = (state: RootState) =>
  state.stories.currentStoryViewingIdx;
export const selectCurrentStoryData = (state: RootState) => {
  if (
    state.stories.currentUserViewingIdx !== null &&
    state.stories.currentStoryViewingIdx !== null
  ) {
    return state.stories.userStoryGroups[state.stories.currentUserViewingIdx]
      .stories[state.stories.currentStoryViewingIdx];
  } else {
    return null;
  }
};

export default storiesSlice.reducer;
