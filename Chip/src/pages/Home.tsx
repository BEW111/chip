// Content feed and stories

import React, {useEffect} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../redux/hooks';

import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import StoryView from '../components/Stories/StoryView';

import {FeedUserStoryGroup} from '../types/stories';

import {styles} from '../styles';
import {
  viewStoryByUserIdx,
  fetchStoriesRequest,
  selectAllStoryGroups,
  selectCurrentUserViewingIdx,
  selectCurrentStoryUser,
} from '../redux/slices/storyFeedSlice';
import {selectUid} from '../redux/slices/authSlice';
import ProfileImageDisplay from '../components/AvatarDisplay';

// StoryAvatar displays an icon with the user and when pressed, will open up the stories
// for that user
type StoryAvatarProps = {
  uid: string;
  userIdx: number;
  viewed: boolean;
};

const StoryAvatar = ({uid, userIdx, viewed}: StoryAvatarProps) => {
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
        <ProfileImageDisplay height={96} width={96} uid={uid} />
      </View>
    </Pressable>
  );
};

export default function Home() {
  // This is normally where we would pull the data from Firebase
  const userStoriesData = useAppSelector(selectAllStoryGroups);
  const currentUserViewingIdx = useAppSelector(selectCurrentUserViewingIdx);
  const dispatch = useAppDispatch();
  const currentUid = useAppSelector(selectUid);

  useEffect(() => {
    dispatch(fetchStoriesRequest(currentUid));
  }, [dispatch, currentUid]);

  return (
    <View style={styles.fullDark}>
      <FocusAwareStatusBar animated={true} barStyle="light-content" />
      {currentUserViewingIdx !== null && <StoryView />}
      <SafeAreaView>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {userStoriesData.map((userStoryGroup, userIdx: number) => (
            <StoryAvatar
              key={`${userStoryGroup.uid}-${userIdx}`}
              uid={userStoryGroup.uid}
              userIdx={userIdx}
              viewed={
                userStoryGroup.stories.filter(story => !story.viewed).length ===
                0
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
