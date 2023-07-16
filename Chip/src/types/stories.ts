// Each user has a group of stories (because they may have posted multiple)
export type UserStoryGroup = {
  user: string;
  stories: StoryData[];
};

// Then each story will look like this
export type StoryData = {
  posted: string;
  image: string; // fix this later
  message: string;
  viewed: boolean;
};
