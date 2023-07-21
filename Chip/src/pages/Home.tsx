import React from 'react';
import {View, ScrollView, Pressable, StyleSheet} from 'react-native';
import {styles} from '../styles';
import {useAppDispatch, useAppSelector} from '../redux/hooks';

// Components
import {SafeAreaView} from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import StoryView from '../components/Stories/StoryView';
import AvatarDisplay from '../components/AvatarDisplay';

// Current state for story viewing
import {
  viewStoryByUserIdx,
  selectCurrentUserViewingIdx,
} from '../redux/slices/storyFeedSlice';
import {useGetStoryGroupsQuery} from '../redux/supabaseApi';
import {SupabaseProfile} from '../types/profiles';

// StoryAvatar displays an icon with the user and when pressed, will open up the stories
// for that user
type StoryAvatarProps = {
  user: SupabaseProfile;
  userIdx: number;
  viewed: boolean;
};

const StoryAvatar = ({user, userIdx, viewed}: StoryAvatarProps) => {
  const dispatch = useAppDispatch();
  const {data: storyGroups} = useGetStoryGroupsQuery();

  const openUserStories = () => {
    if (storyGroups && storyGroups.length > 0) {
      dispatch(viewStoryByUserIdx({newIdx: userIdx, storyGroups}));
    }
  };

  return (
    <Pressable onPress={openUserStories}>
      <View style={localStyles(viewed).storyAvatarWrapper}>
        <AvatarDisplay height={96} width={96} url={user.avatar_url} />
      </View>
    </Pressable>
  );
};

export default function Home() {
  // Keep track of the current user of the stories we're viewing
  const currentUserViewingIdx = useAppSelector(selectCurrentUserViewingIdx);
  const {data: storyGroups} = useGetStoryGroupsQuery();

  return (
    <View style={styles.fullDark}>
      <FocusAwareStatusBar animated={true} barStyle="light-content" />
      {currentUserViewingIdx !== null && <StoryView />}
      <SafeAreaView>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {storyGroups &&
            storyGroups.length > 0 &&
            storyGroups.map((storyGroup, userIdx: number) => (
              <StoryAvatar
                key={`${storyGroup.creator.id}-${userIdx}`}
                user={storyGroup.creator}
                userIdx={userIdx}
                viewed={
                  storyGroup.stories.filter(story => !story.viewed).length === 0
                }
              />
            ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const localStyles = (viewed: boolean) =>
  StyleSheet.create({
    storyAvatarWrapper: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: viewed ? 'gray' : 'white',
      borderWidth: 4,
      borderRadius: 108,
      height: 108,
      width: 108,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 8,
    },
  });
