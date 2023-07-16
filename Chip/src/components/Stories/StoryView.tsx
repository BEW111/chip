import React from 'react';

import {View, Pressable, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {styles} from '../../styles';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  selectCurrentStoryData,
  viewNextStory,
  stopViewingStory,
} from '../../redux/slices/storiesSlice';

// Component to show when the user is viewing stories currently
const StoryView = () => {
  const storyData = useAppSelector(selectCurrentStoryData);
  const dispatch = useAppDispatch();

  const nextStory = () => {
    dispatch(viewNextStory());
  };

  const close = () => {
    dispatch(stopViewingStory());
  };

  return (
    <View style={styles.fullDark}>
      <View style={styles.centeredExpand}>
        {storyData !== null ? (
          <Text style={{color: 'green'}}>{storyData.message}</Text>
        ) : (
          <Text style={{color: 'red'}}>An error occurred fetching data</Text>
        )}
      </View>
      <View style={storyViewStyles.mainWrapper}>
        <Pressable
          style={{backgroundColor: 'red', width: '30%'}}
          onPress={close}
        />
        <Pressable
          style={{backgroundColor: 'green', width: '30%'}}
          onPress={nextStory}
        />
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
