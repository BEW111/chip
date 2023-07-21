import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {styles} from '../../styles';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';

// Components
import {ActivityIndicator, Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

// Story view control
import {
  selectCurrentUserViewingIdx,
  selectCurrentStoryViewingIdx,
  viewNextStory,
  stopViewingStory,
} from '../../redux/slices/storyFeedSlice';
import {useGetStoryGroupsQuery} from '../../redux/supabaseApi';
import {supabase} from '../../supabase/supabase';

// Component to show when the user is viewing stories currently
const StoryView = () => {
  // Stories
  const {data: storyGroups} = useGetStoryGroupsQuery();

  // Current state
  const currentUserIdx = useAppSelector(selectCurrentUserViewingIdx);
  const currentStoryIdx = useAppSelector(selectCurrentStoryViewingIdx);

  // Updating state
  const dispatch = useAppDispatch();
  const nextStory = () => {
    if (storyGroups) {
      dispatch(viewNextStory(storyGroups));
    }
  };
  const close = () => {
    dispatch(stopViewingStory());
  };

  // Image
  const [isLoading, setIsLoading] = useState(true);
  const [storyImageUri, setStoryImageUri] = useState<string | null>(null);
  useEffect(() => {
    console.log('USE EFFECT');
    const updateStoryPhoto = async () => {
      console.log('loading image...');
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

          console.log(data);

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
  console.log(currentStory);

  return (
    <View style={styles.fullDark}>
      {storyImageUri ? (
        <FastImage source={{uri: storyImageUri}} style={styles.absoluteFull} />
      ) : (
        <View style={styles.absoluteFullCentered}>
          <ActivityIndicator />
        </View>
      )}
      <View style={styles.centeredExpand}>
        {currentStory !== null ? (
          <Text style={{color: 'green'}}>{currentStory.message}</Text>
        ) : (
          <Text style={{color: 'red'}}>An error occurred fetching data</Text>
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
});
