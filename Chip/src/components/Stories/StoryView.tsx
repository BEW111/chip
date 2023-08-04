import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {styles} from '../../styles';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';

// Components
import {ActivityIndicator, Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

// Story navigation control
import {
  selectCurrentUserViewingIdx,
  selectCurrentStoryViewingIdx,
  viewNextStory,
  stopViewingStory,
} from '../../redux/slices/storyFeedSlice';
import {useGetStoryGroupsQuery} from '../../redux/supabaseApi';
import {supabase} from '../../supabase/supabase';

// Marking stories as viewed
import {findNextUnviewedStory} from '../../utils/stories';
import {insertStoryView} from '../../supabase/stories';
import {SupabaseStoryViewUpload} from '../../types/stories';
import {selectUid} from '../../redux/slices/authSlice';

// Component to show when the user is viewing stories currently
const StoryView = () => {
  const uid = useAppSelector(selectUid);

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

  return (
    <View style={styles.fullDark}>
      {storyImageUri && !isLoading ? (
        <FastImage source={{uri: storyImageUri}} style={styles.absoluteFull} />
      ) : (
        <View style={styles.absoluteFullCentered}>
          <ActivityIndicator />
        </View>
      )}
      <View style={styles.centeredExpand}>
        {currentStory !== null && !isLoading && (
          <View style={storyViewStyles.storyTextWrapper}>
            <Text variant="bodyLarge" style={storyViewStyles.storyText}>
              {/* {currentStory.message} */}
              test test
            </Text>
          </View>
        )}
      </View>
      <View style={storyViewStyles.mainWrapper}>
        <Pressable style={{width: '30%'}} onPress={close} />
        <Pressable style={{width: '30%'}} onPress={nextStory} />
      </View>
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
  storyTextWrapper: {
    width: '100%',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  storyText: {textAlign: 'center', color: 'white'},
});
