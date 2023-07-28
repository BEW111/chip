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
import {insertStoryView} from '../supabase/stories';
import {SupabaseProfile} from '../types/profiles';
import {SupabaseStoryViewUpload} from '../types/stories';
import {selectUid} from '../redux/slices/authSlice';

// StoryAvatar displays an icon with the user and when pressed, will open up the stories
// for that user
type StoryAvatarProps = {
  user: SupabaseProfile;
  userIdx: number;
  viewed: boolean;
};

const StoryAvatar = ({user, userIdx, viewed}: StoryAvatarProps) => {
  const dispatch = useAppDispatch();
  const uid = useAppSelector(selectUid);
  const {data: storyGroups} = useGetStoryGroupsQuery();

  const openUserStories = () => {
    if (storyGroups && storyGroups.length > 0 && uid !== null) {
      // Navigate to the first story
      dispatch(viewStoryByUserIdx({newIdx: userIdx, storyGroups}));

      // Mark the story we're opening as viewed
      const nextStoryIdx = storyGroups[userIdx].stories.findIndex(
        story => !story.viewed,
      );

      if (nextStoryIdx !== -1) {
        const viewRecord: SupabaseStoryViewUpload = {
          story_id: storyGroups[userIdx].stories[nextStoryIdx].id,
          poster_id: storyGroups[nextStoryIdx].creator.id,
          viewer_id: uid,
        };
        insertStoryView(viewRecord);
      }
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
