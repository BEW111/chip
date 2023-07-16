import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';

import {UserStoryGroup} from '../types/stories';

// We assume that based on the way we have implemented the functionality
// for adding the stories, that the users are sorted in reverse order
// of the last story added
type StoriesState = {
  userStoryGroups: UserStoryGroup[];
  currentUserViewing: string | null;
};

const storiesDemoData: UserStoryGroup[] = [
  {
    user: 'bob',
    stories: [
      {
        posted: 'date here',
        image: 'cool image of bob',
        message: 'hi im bob',
      },
    ],
    unviewedStoriesIndices: [0],
  },
  {
    user: 'blair',
    stories: [
      {
        posted: 'date here',
        image: 'cool image of blair',
        message: 'blair message',
      },
    ],
    unviewedStoriesIndices: [0],
  },
  {
    user: 'tj strawberry',
    stories: [
      {
        posted: 'date here',
        image: 'cool image of tj',
        message: '🍓',
      },
      {
        posted: 'date here',
        image: 'another cool image of tj',
        message: 'tj on that strawberry',
      },
    ],
    unviewedStoriesIndices: [0, 1],
  },
  {
    user: 'casey',
    stories: [
      {
        posted: 'date here',
        image: 'cool image of casey',
        message: 'casey message',
      },
    ],
    unviewedStoriesIndices: [0],
  },
];

const initialState: StoriesState = {
  userStoryGroups: storiesDemoData,
  currentUserViewing: null, // the current user for the stories we're viewing right now
};

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
  },
});

export const {markAsViewed, setCurrentUserViewing} = storiesSlice.actions;
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
