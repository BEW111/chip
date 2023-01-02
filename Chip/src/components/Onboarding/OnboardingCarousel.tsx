import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, Divider} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

import {styles} from '../../styles';

import Onboarding1 from '../../../assets/onboarding_1.png';
import Onboarding2 from '../../../assets/onboarding_2.png';
import Onboarding3 from '../../../assets/onboarding_3.png';
import FastImage from 'react-native-fast-image';

const slides = [
  {
    headline: 'Capture habits in time',
    caption: 'Record your habits by sending photos to friends',
  },
  {
    headline: 'Gain valuable insights',
    caption: 'Learn what strategies work best for you',
  },
  {
    headline: 'Stay consistent together',
    caption: 'If either of you break your streak, then a superstreak ends',
  },
];

function OnboardingCarousel() {
  const width = Dimensions.get('window').width;
  const [currentIndex, setCurrentIndex] = useState(0);

  const imgs = [Onboarding1, Onboarding2, Onboarding3];
  const imgStyles = [
    {width: 275, height: 315.56},
    {width: 294, height: 321},
    {width: 294, height: 321},
  ];

  return (
    <View style={styles.full}>
      <Carousel
        autoPlay
        autoPlayInterval={6000}
        width={width}
        height={width * 1.05}
        data={slides}
        scrollAnimationDuration={400}
        onSnapToItem={index => setCurrentIndex(index)}
        renderItem={({item, index}) => (
          <View style={localStyles.carouselView}>
            <Text style={styles.textCentered} variant="headlineSmall">
              {item.headline}
            </Text>
            <Divider style={styles.dividerSmall} />
            <FastImage source={imgs[index]} style={imgStyles[index]} />
            <Divider style={styles.dividerSmall} />
            <Text style={styles.textCentered} variant="bodyMedium">
              {item.caption}
            </Text>
          </View>
        )}
      />
      <Divider style={styles.dividerMedium} />
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
    width: 6,
    height: 6,
    borderRadius: 20,
    marginHorizontal: 2,
    backgroundColor: '#546E7A',
  },
  dotActive: {
    width: 6,
    height: 6,
    borderRadius: 20,
    marginHorizontal: 2,
    backgroundColor: '#EC407A',
  },
  carouselView: {
    flex: 1,
    alignItems: 'center',
  },
});

export default OnboardingCarousel;
