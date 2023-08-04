import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, Divider, Modal, IconButton, useTheme} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

import {styles} from '../../styles';

import ChipIcon from '../../../assets/chips-icon.png';
import CameraIcon from '../../../assets/camera_icon_watercolor_art.png';
import FriendsIcon from '../../../assets/friends_icon_watercolor_art.png';
import FireIcon from '../../../assets/fire_icon_watercolor_art.png';
import FastImage from 'react-native-fast-image';
import {useAppDispatch} from '../../redux/hooks';
import {updateTutorialStage} from '../../redux/slices/tutorialSlice';

type OnboardingCarouselModalProps = {
  visible: boolean;
};

function OnboardingCarouselModal({visible}: OnboardingCarouselModalProps) {
  const carouselPlayInterval = 10000;

  const carouselWidth = Dimensions.get('window').width * 0.95;
  const carouselHeight = carouselWidth * 1.3;
  const [currentIndex, setCurrentIndex] = useState(0);

  const imgs = [ChipIcon, CameraIcon, FriendsIcon, FireIcon];
  const imgStyles = [
    {width: 300, height: 300},
    {width: 300, height: 300},
    {width: 300, height: 300},
    {width: 300, height: 300},
  ];

  const dispatch = useAppDispatch();
  const onModalDismiss = () => {
    dispatch(updateTutorialStage('goals-wait-start-create'));
  };

  const slides = [
    {
      headline: 'What is Chip?',
      caption: 'Chip is a social media platform for habits and goals',
    },
    {
      headline: 'Track your goals with pictures',
      caption: '',
    },
    {
      headline: 'Share progress with friends',
      caption: 'Chips for public goals are uploaded to your story',
    },
    {
      headline: 'Stay accountable with streaks',
      caption:
        'Create shared "superstreaks" which end if either either you or a friend break a streak',
    },
  ];

  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      onDismiss={onModalDismiss}
      contentContainerStyle={
        localStyles(carouselWidth, carouselHeight).containerStyle
      }>
      <IconButton
        icon={'close-outline'}
        onPress={onModalDismiss}
        style={localStyles(carouselWidth, carouselHeight).closeIcon}
      />
      <Divider style={styles.dividerLarge} />
      <View style={localStyles(carouselWidth, carouselHeight).carouselWrapper}>
        <Carousel
          //   autoPlay
          //   autoPlayInterval={carouselPlayInterval}
          width={carouselWidth}
          height={carouselHeight}
          data={slides}
          scrollAnimationDuration={400}
          loop={false}
          onSnapToItem={index => setCurrentIndex(index)}
          renderItem={({item, index}) => (
            <View
              style={localStyles(carouselWidth, carouselHeight).carouselView}>
              <Text style={styles.textCentered} variant="titleLarge">
                {item.headline}
              </Text>
              <Divider style={styles.dividerSmall} />
              <FastImage source={imgs[index]} style={imgStyles[index]} />
              <Divider style={styles.dividerSmall} />
              <Text
                style={localStyles(carouselWidth, carouselHeight).captionText}
                variant="bodyMedium">
                {index === 1 ? (
                  <Text variant="bodyMedium">
                    Record your habits by sending{' '}
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: theme.colors.primary,
                      }}
                      variant="bodyMedium">
                      chips
                    </Text>{' '}
                    to friends
                  </Text>
                ) : (
                  item.caption
                )}
              </Text>
            </View>
          )}
        />
        <Divider style={styles.dividerMedium} />
      </View>
      <View style={styles.centered}>
        <View style={styles.rowCentered}>
          {[...new Array(slides.length).keys()].map(item => (
            <View
              key={item}
              style={
                item === currentIndex
                  ? localStyles(carouselWidth, carouselHeight).dotActive
                  : localStyles(carouselWidth, carouselHeight).dot
              }
            />
          ))}
        </View>
      </View>
      <Divider style={styles.dividerMedium} />
    </Modal>
  );
}

const localStyles = (carouselWidth: number, carouselHeight: number) =>
  StyleSheet.create({
    containerStyle: {
      backgroundColor: 'white',
      borderRadius: 20,

      alignSelf: 'center',
      width: carouselWidth,

      alignItems: 'center',
      justifyContent: 'center',
    },
    carouselWrapper: {
      height: carouselHeight,
      paddingTop: 20,
    },
    captionText: {
      textAlign: 'center',
      marginHorizontal: 30,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 20,
      marginHorizontal: 2,
      backgroundColor: '#546E7A',
    },
    closeIcon: {
      marginRight: 10,
      marginTop: 10,
      alignSelf: 'flex-end',
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

export default OnboardingCarouselModal;
