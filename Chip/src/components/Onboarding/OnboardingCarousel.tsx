import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, Divider} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

import {styles} from '../../styles';

const slides = [
  {
    headline: 'Capture habits in time',
  },
  {
    headline: 'Work together',
  },
  {
    headline: 'Work smarter',
  },
];

function OnboardingCarousel() {
  const width = Dimensions.get('window').width;
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.full}>
      <Carousel
        autoPlay
        autoPlayInterval={4000}
        width={width}
        height={width}
        data={slides}
        scrollAnimationDuration={400}
        onSnapToItem={index => setCurrentIndex(index)}
        renderItem={({item, index}) => (
          <View style={localStyles.carouselView}>
            <Text style={styles.textCentered} variant="headlineSmall">
              {item.headline}
            </Text>
          </View>
        )}
      />
      <Divider style={styles.dividerSmall} />
      <View style={styles.centered}>
        <View style={styles.rowCentered}>
          {[...new Array(slides.length).keys()].map(item => (
            <View
              key={item}
              style={
                item === currentIndex ? localStyles.dotActive : localStyles.dot
              }
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 20,
    marginHorizontal: 2,
    backgroundColor: '#546E7A',
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 20,
    marginHorizontal: 2,
    backgroundColor: '#EC407A',
  },
  carouselView: {
    flex: 1,
    padding: 12,
  },
});

export default OnboardingCarousel;
