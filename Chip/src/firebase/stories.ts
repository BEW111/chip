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
          viewed: false,
        },
      ],
    },
    {
      user: 'blair',
      stories: [
        {
          posted: 'date here',
          image: 'cool image of blair',
          message: 'blair message',
          viewed: false,
        },
      ],
    },
    {
      user: 'tj strawberry',
      stories: [
        {
          posted: 'date here',
          image: 'cool image of tj',
          message: '🍓',
          viewed: false,
        },
        {
          posted: 'date here',
          image: 'another cool image of tj',
          message: 'tj on that strawberry',
          viewed: false,
        },
      ],
    },
    {
      user: 'casey',
      stories: [
        {
          posted: 'date here',
          image: 'cool image of casey',
          message: 'casey message',
          viewed: false,
        },
      ],
    },
  ];

  return storiesDemoData;
}
