/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Surface, Text, IconButton} from 'react-native-paper';
import ImageStackCarousel from '../GoalDetail/ImageStackCarousel';

const ITEM_WIDTH = 144;

export default function ImageCarouselWidget({navigation, chips}) {
  return (
    <Surface
      style={{
        width: '100%',
        elevation: 0,
        borderRadius: 10,
        backgroundColor: '#FFEEF8',
        overflow: 'hidden',
      }}>
      <View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 18,
              paddingHorizontal: 16,
              paddingTop: 12,
            }}>
            Latest chips
          </Text>
          <IconButton
            icon={'search-circle-outline'}
            size={36}
            style={{margin: -6}}
            color={'black'}
            onPress={() => console.log('image carousel widget')}
          />
        </View>
      </View>
      <View style={styles.container}>
        <ImageStackCarousel chips={chips} />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  box: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 20,
    // backgroundColor: 'white',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },
});
