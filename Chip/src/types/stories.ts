// Each user has a group of stories (because they may have posted multiple)
// We assume that the stories are sorted in reverse chronological order
// We also need to keep track of which stories the local user has viewed.
// For now (TODO: I might want to change this later to optimize for speed and robustness)
// we keep track of all the indices within our "stories" array for the unviewed stories.
// Thus, we can get the first story to be viewed by checking the last index in this array,
// and can quickly check if no stories are unviewed if the array is empty
export type UserStoryGroup = {
  user: string;
  stories: StoryData[];
  unviewedStoriesIndices: number[]; // Last element is the first to to be viewed
};

// Then each story will look like this
export type StoryData = {
  posted: string;
  image: string; // fix this later
  message: string;
};
