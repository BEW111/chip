import React, {useCallback} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {interpolate} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import ChipDisplayMini from './ChipDisplayMini';

const WIDTH = 100;

function ImageStackCarousel({chips}) {
  const animationStyle: TAnimationStyle = useCallback((value: number) => {
    'worklet';

    const zIndex = interpolate(value, [-2, -1, 0, 1, 2], [10, 30, 50, 40, 20]);
    const translateX = interpolate(
      value,
      [-2, -1, 0, 1, 2],
      [WIDTH * 1.5, -WIDTH * 0.5, 0, WIDTH * 0.5, -WIDTH * 1.5],
    );
    const rotateZ = interpolate(
      value,
      [-2, -1, 0, 1, 2],
      [0.17, -0.2, 0, 0.1, -0.15],
    );

    return {
      transform: [{translateX}, {rotateZ}],
      zIndex,
    };
  }, []);

  const width = Dimensions.get('window').width;

  return (
    <View style={{flex: 1}}>
      <Carousel
        loop
        width={128}
        height={128}
        autoPlay={false}
        style={{
          width: '100%',
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        windowSize={5}
        customAnimation={animationStyle}
        data={chips}
        scrollAnimationDuration={1000}
        onSnapToItem={index => console.log('current index:', index)}
        renderItem={({index}) => <ChipDisplayMini chip={chips[index]} />}
      />
    </View>
  );
}

export default ImageStackCarousel;
