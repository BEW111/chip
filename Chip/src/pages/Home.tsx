// Content feed and stories

import React, {useState} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../redux/hooks';

import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

import {StoryData, UserStoryGroup} from '../types/stories';

import {styles} from '../styles';
import {
  selectAllStoryGroups,
  selectCurrentUserViewing,
  setCurrentUserViewing,
} from '../redux/slices/storiesSlice';

// StoryButton displays an icon with the user and when pressed, will open up the stories
// for that user
type StoryButtonProps = {
  user: string;
  viewed: boolean;
  openStories: () => void;
  closeStories: () => void;
};

const StoryButton = ({user, viewed}: StoryButtonProps) => {
  const dispatch = useAppDispatch();

  const openUserStories = () => {
    dispatch(setCurrentUserViewing(user));
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

// Component to show when the user is viewing stories currently
type StoriesViewProps = {
  currentStoryUser: StoryData;
};
function StoriesView() {
  return (
    <View style={styles.fullPaddedDark}>
      <Text>Stories viewer</Text>
    </View>
  );
}

export default function Home() {
  // This is normally where we would pull the data from Firebase
  const userStoriesData = useAppSelector(selectAllStoryGroups);
  const currentUserViewing = useAppSelector(selectCurrentUserViewing);

  return (
    <View style={styles.fullDark}>
      <FocusAwareStatusBar animated={true} barStyle="light-content" />
      {currentUserViewing && <StoriesView />}
      <SafeAreaView>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {userStoriesData.map((userStories: UserStoryGroup) => (
            <StoryButton
              key={userStories.user}
              user={userStories.user}
              viewed={userStories.unviewedStoriesIndices.length === 0}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
