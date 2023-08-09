import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {styles} from '../../styles';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Components
import {ActivityIndicator, Divider, IconButton, Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Icon from 'react-native-vector-icons/Ionicons';

// Story navigation control
import {
  selectCurrentUserViewingIdx,
  selectCurrentStoryViewingIdx,
  viewNextStory,
  stopViewingStory,
} from '../../redux/slices/storyFeedSlice';
import {useGetStoryGroupsQuery} from '../../redux/slices/storiesSlice';
import {supabase} from '../../supabase/supabase';

// Marking stories as viewed
import {findNextUnviewedStory} from '../../utils/stories';
import {insertStoryView} from '../../supabase/stories';
import {SupabaseStoryViewUpload} from '../../types/stories';
import {selectUid} from '../../redux/slices/authSlice';
import {BlurView} from '@react-native-community/blur';
import AvatarDisplay from '../AvatarDisplay';

// Component to show when the user is viewing stories currently
const StoryView = () => {
  const uid = useAppSelector(selectUid);
  const insets = useSafeAreaInsets();

  // Stories
  const {data: storyGroups, refetch: refetchStoryGroups} =
    useGetStoryGroupsQuery();

  // Current state
  const currentUserIdx = useAppSelector(selectCurrentUserViewingIdx);
  const currentStoryIdx = useAppSelector(selectCurrentStoryViewingIdx);

  // Updating state and marking as viewed
  const dispatch = useAppDispatch();
  const nextStory = () => {
    if (
      storyGroups &&
      currentUserIdx !== null &&
      currentStoryIdx !== null &&
      uid !== null
    ) {
      dispatch(viewNextStory(storyGroups));

      // Mark the story we're moving to as viewed
      const {nextUserIdx, nextStoryIdx} = findNextUnviewedStory(
        currentUserIdx,
        currentStoryIdx,
        storyGroups,
      );

      if (nextUserIdx !== null && nextStoryIdx !== null) {
        const viewRecord: SupabaseStoryViewUpload = {
          story_id: storyGroups[nextUserIdx].stories[nextStoryIdx].id,
          poster_id: storyGroups[nextUserIdx].creator.id,
          viewer_id: uid,
        };
        insertStoryView(viewRecord);
      } else {
        // If we couldn't find another story, then we're gonna close, and so
        // we should refetch all of the stories data
        refetchStoryGroups();
      }
    }
  };

  // When we close, we should refetch stories
  const close = () => {
    dispatch(stopViewingStory());
    refetchStoryGroups();
  };

  // Image
  const [isLoading, setIsLoading] = useState(true);
  const [storyImageUri, setStoryImageUri] = useState<string | null>(null);
  useEffect(() => {
    const updateStoryPhoto = async () => {
      setIsLoading(true);
      try {
        if (
          currentUserIdx !== null &&
          currentStoryIdx !== null &&
          storyGroups
        ) {
          const currentStory =
            storyGroups[currentUserIdx].stories[currentStoryIdx];
          const {data, error} = await supabase.storage
            .from('chips')
            .download(currentStory.photo_path);

          if (error) {
            throw error;
          }

          const fr = new FileReader();
          fr.readAsDataURL(data);
          fr.onload = () => {
            setStoryImageUri(fr.result as string);
            setIsLoading(false);
          };
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error downloading image: ', error.message);
        }
      }
    };

    updateStoryPhoto();
  }, [currentUserIdx, currentStoryIdx, storyGroups]);

  // TODO: loading screen here
  if (currentUserIdx === null || currentStoryIdx === null || !storyGroups) {
    return (
      <View style={styles.fullDark}>
        <View style={styles.centeredExpand}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  const currentStory = storyGroups[currentUserIdx].stories[currentStoryIdx];
  const currentUser = storyGroups[currentUserIdx].creator;

  return (
    <View style={[styles.absoluteFull]}>
      {/* Main image */}
      {storyImageUri && !isLoading ? (
        <FastImage source={{uri: storyImageUri}} style={styles.absoluteFull} />
      ) : (
        <View style={styles.absoluteFullCentered}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={styles.absoluteFull}
            shimmerColors={['#050505', '#1A1A1B', '#070707']}
          />
        </View>
      )}
      {/* Close out of story */}
      <View style={storyViewStyles.mainWrapper}>
        <Pressable style={{width: '50%'}} onPress={close} />
        <Pressable style={{width: '50%'}} onPress={nextStory} />
      </View>
      {/* Top blur */}
      <BlurView
        blurAmount={8}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          paddingTop: insets.top + 10,
          paddingLeft: 20,
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 20,
        }}>
        <AvatarDisplay width={64} height={64} url={currentUser.avatar_url} />
        <Divider style={styles.dividerHSmall} />
        <Text variant="bodyLarge" style={storyViewStyles.usernameText}>
          @{currentUser.username}
        </Text>
        <IconButton
          icon="close-outline"
          iconColor="white"
          size={36}
          style={{marginLeft: 'auto', marginRight: 10}}
          onPress={close}
        />
      </BlurView>
      {/* Goal info */}
      {currentStory.goal !== null && (
        <BlurView style={storyViewStyles.goalInfoWrapper}>
          <View style={storyViewStyles.emojiWrapper}>
            <Text variant="displayMedium">{currentStory.goal.emoji}</Text>
          </View>
          <View style={storyViewStyles.storyTextWrapper}>
            <Text
              variant="bodyLarge"
              style={storyViewStyles.goalNameText}
              numberOfLines={1}>
              {currentStory.goal.name}
            </Text>
            <Text
              variant="bodyMedium"
              style={storyViewStyles.storyText}
              numberOfLines={1}>
              {currentStory.message === ''
                ? 'No notes provided'
                : `"${currentStory.message}"`}
            </Text>
          </View>
          <View style={storyViewStyles.streakContainer}>
            <Icon name="flame-outline" size={32} color="white" />
            <Divider style={styles.dividerHTiny} />
            <Text variant="displaySmall" style={storyViewStyles.streakText}>
              {currentStory.goal.streak_count}
            </Text>
          </View>
        </BlurView>
      )}
    </View>
  );
};

export default StoryView;

const storyViewStyles = StyleSheet.create({
  mainWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
  goalInfoWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,

    borderRadius: 16,
    margin: 12,

    padding: 12,
    paddingTop: 16,

    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
  },
  emojiWrapper: {
    paddingRight: 12,
  },
  storyTextWrapper: {flexShrink: 0, flex: 4},
  storyText: {color: 'white'},
  usernameText: {color: 'white'},
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  streakText: {color: 'white'},
  goalNameText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
