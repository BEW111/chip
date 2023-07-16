import {UserStoryGroup} from '../types/stories';

export async function fetchStoriesFromFirestore() {
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

  return storiesDemoData;
}
