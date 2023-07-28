// Slice for stories
// Note that each user will have a group of stories, so we keep track
// of which user we're viewing stories for, and which stories we're actually viewing

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {StoryGroup} from '../../types/stories';
import {findNextUnviewedStory, findNextStory} from '../../utils/stories';

// We assume that based on the way we have implemented the functionality
// for adding the stories, that the users are sorted in reverse order
// of the last story added
type StoriesState = {
  currentUserViewingIdx: number | null;
  currentStoryViewingIdx: number | null;
  justViewedNewStory: boolean;
};

const initialState: StoriesState = {
  currentUserViewingIdx: null, // the current user for the stories we're viewing right now
  currentStoryViewingIdx: null, // the current story we're viewing, by index
  justViewedNewStory: false,
};

// Payloads
type ViewStoryByUserIdxPayload = {
  storyGroups: StoryGroup[];
  newIdx: number;
};

export const storyFeedSlice = createSlice({
  name: 'storyFeed',
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
      const storyIdx = action.payload.storyGroups[
        action.payload.newIdx
      ].stories.findIndex(story => !story.viewed);

      // We've already viewed all stories for this user, so just return the first one
      if (storyIdx === -1) {
        state.currentUserViewingIdx = action.payload.newIdx;
        state.currentStoryViewingIdx = 0;
        state.justViewedNewStory = false;
      } else {
        // We haven't viewed a certain story yet, so change to it and mark as viewed
        state.currentUserViewingIdx = action.payload.newIdx;
        state.currentStoryViewingIdx = storyIdx;
        state.justViewedNewStory = true;
      }
    },
    // A user moves to the next story that should be viewed
    // If we just viewed a new story, we should look for the next unviewed story,
    // but if we just viewed an old story, we should just look for the next story in general
    viewNextStory: (state, action: PayloadAction<StoryGroup[]>) => {
      // This function shouldn't be used when either of these are null
      if (
        state.currentStoryViewingIdx == null ||
        state.currentUserViewingIdx == null
      ) {
        return;
      }

      // Update state (will automatically update to null if nothing is left)
      // If we just viewed a new (unviewed) story, then we should get the next unviewed story
      const findNextStoryFunction = state.justViewedNewStory
        ? findNextUnviewedStory
        : findNextStory;

      const {nextUserIdx, nextStoryIdx} = findNextStoryFunction(
        state.currentUserViewingIdx,
        state.currentStoryViewingIdx,
        action.payload,
      );

      state.currentUserViewingIdx = nextUserIdx;
      state.currentStoryViewingIdx = nextStoryIdx;

      if (nextUserIdx !== null && nextStoryIdx !== null) {
        // Mark story as viewed
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
  },
});

export const {viewStoryByUserIdx, viewNextStory, stopViewingStory} =
  storyFeedSlice.actions;
export const selectCurrentUserViewingIdx = (state: RootState) =>
  state.storyFeed.currentUserViewingIdx;
export const selectCurrentStoryViewingIdx = (state: RootState) =>
  state.storyFeed.currentStoryViewingIdx;

export default storyFeedSlice.reducer;
