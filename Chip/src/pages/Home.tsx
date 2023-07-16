// Content feed and stories

import React, {useEffect} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../redux/hooks';

import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import StoryView from '../components/Stories/StoryView';

import {UserStoryGroup} from '../types/stories';

import {styles} from '../styles';
import {
  viewStoryByUserIdx,
  fetchStoriesRequest,
  selectAllStoryGroups,
  selectCurrentUserViewingIdx,
} from '../redux/slices/storiesSlice';

// StoryAvatar displays an icon with the user and when pressed, will open up the stories
// for that user
type StoryAvatarProps = {
  user: string;
  userIdx: number;
  viewed: boolean;
};

const StoryAvatar = ({user, userIdx, viewed}: StoryAvatarProps) => {
  const dispatch = useAppDispatch();

  const openUserStories = () => {
    dispatch(viewStoryByUserIdx(userIdx));
  };

  return (
    <Pressable onPress={openUserStories}>
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: viewed ? 'gray' : 'white',
          borderWidth: 4,
          borderRadius: 108,
          height: 108,
          width: 108,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 8,
        }}>
        <View
          style={{
            borderRadius: 100,
            backgroundColor: 'pink',
            height: 96,
            width: 96,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{user}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default function Home() {
  // This is normally where we would pull the data from Firebase
  const userStoriesData = useAppSelector(selectAllStoryGroups);
  const currentUserViewingIdx = useAppSelector(selectCurrentUserViewingIdx);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStoriesRequest());
  }, [dispatch]);

  return (
    <View style={styles.fullDark}>
      <FocusAwareStatusBar animated={true} barStyle="light-content" />
      {currentUserViewingIdx !== null && <StoryView />}
      <SafeAreaView>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {userStoriesData.map(
            (userStoryGroup: UserStoryGroup, userIdx: number) => (
              <StoryAvatar
                key={`${userStoryGroup.user}-${userIdx}`}
                user={userStoryGroup.user}
                userIdx={userIdx}
                viewed={
                  userStoryGroup.stories.filter(story => !story.viewed)
                    .length === 0
                }
              />
            ),
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
