import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Text, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles';
import BlurSurface from '../BlurSurface';
import ImageStackCarousel from '../GoalDetail/ImageStackCarousel';

const ITEM_WIDTH = 144;

export default function ImageCarouselWidget({goal, chips}) {
  return (
    <BlurSurface padding={2}>
      <View>
        <View style={styles.rowSpaceBetween}>
          <Text variant="titleSmall" style={styles.widgetTitle}>
            <Icon name={'images-outline'} color={'gray'} size={16} /> Latest
            Chips
          </Text>
          {/* <IconButton
            icon={'search-circle-outline'}
            size={36}
            style={{margin: -6}}
            color={'black'}
            onPress={() => console.log('image carousel widget')}
          /> */}
        </View>
      </View>
      {chips.length > 0 ? (
        <View style={localStyles.container}>
          <Divider style={styles.dividerSmall} />
          <ImageStackCarousel goal={goal} chips={chips} />
        </View>
      ) : (
        <View style={localStyles.containerNone}>
          <Text variant="bodyMedium" style={styles.textCentered}>
            No photos to show yet. Take advantage of the fresh start and submit
            a chip!
          </Text>
        </View>
      )}
    </BlurSurface>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'visible',
  },
  containerNone: {
    width: '100%',
    height: 80,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
