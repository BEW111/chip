import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

import Carousel from 'react-native-snap-carousel';

const OnboardingCarousel = () => {
  const sliderWidth = 200;
  const itemWidth = 300;

  const entries = [
    {
      title: 'test',
    },
    {
      title: 'test2',
    },
  ];

  const _renderItem = ({item, index}) => {
    return (
      <View style={localStyles.slide}>
        <Text variant="titleSmall">{item.title}</Text>
      </View>
    );
  };

  return (
    <Carousel
      layout="default"
      data={entries}
      renderItem={_renderItem}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
    />
  );
};

const localStyles = StyleSheet.create({
  slide: {},
});

export default OnboardingCarousel;
