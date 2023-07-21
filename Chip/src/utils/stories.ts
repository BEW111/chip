import {StoryGroup} from '../types/stories';

// Helper function to find the next unviewed story, starting from the
// indexes for a current user and story. Note that this helper function does
// not mutate state.
export const findNextUnviewedStory = (
  userIdx: number,
  storyIdx: number,
  storyGroups: StoryGroup[],
) => {
  let nextUserIdx = userIdx;
  let nextStoryIdx = storyIdx + 1;

  while (nextUserIdx <= storyGroups.length - 1) {
    // Check if there is another story for this user
    while (nextStoryIdx <= storyGroups[nextUserIdx].stories.length - 1) {
      // If the story isn't viewed, then we can return it
      if (!storyGroups[nextUserIdx].stories[nextStoryIdx].viewed) {
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

// Helper function to find the next story, even if it has already
// been viewed
export const findNextStory = (
  userIdx: number,
  storyIdx: number,
  storyGroups: StoryGroup[],
) => {
  const currentStories = storyGroups[userIdx].stories;

  // Last user, last story
  if (
    userIdx === storyGroups.length - 1 &&
    storyIdx === currentStories.length - 1
  ) {
    return {nextUserIdx: null, nextStoryIdx: null};
  }

  // Last user, but not last story
  if (
    userIdx === storyGroups.length - 1 &&
    storyIdx < currentStories.length - 1
  ) {
    return {nextUserIdx: userIdx, nextStoryIdx: storyIdx + 1};
  }

  // Not last user, but last story
  if (
    userIdx < storyGroups.length - 1 &&
    storyIdx === currentStories.length - 1
  ) {
    return {nextUserIdx: userIdx + 1, nextStoryIdx: 0};
  }

  // Not last user, not last story either
  return {nextUserIdx: userIdx, nextStoryIdx: storyIdx + 1};
};
