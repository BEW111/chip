import React, {useCallback} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {interpolate} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import ChipDisplayMini from './ChipDisplayMini';

const WIDTH = 150;

function ImageStackCarousel({goal, chips}) {
  const animationStyle: TAnimationStyle = useCallback((value: number) => {
    'worklet';

    const zIndex = interpolate(value, [-2, -1, 0, 1, 2], [10, 30, 50, 40, 20]);
    const translateX = interpolate(
      value,
      [-2, -1, 0, 1, 2],
      [WIDTH * 0.3, -WIDTH * 0.5, 0, WIDTH * 0.5, -WIDTH * 0.3],
    );
    const rotateZ = interpolate(value, [-2, -1, 0, 1, 2], [3, -7, 0, 5, -6]);
    const opacity = interpolate(value, [-2, -1, 0, 1, 2], [0, 0.9, 1, 0.9, 0]);

    return {
      transform: [{translateX}, {rotateZ: `${rotateZ}deg`}],
      opacity,
      zIndex,
    };
  }, []);

  const width = Dimensions.get('window').width;

  return (
    <View style={{flex: 1}}>
      <Carousel
        loop={false}
        width={WIDTH}
        height={WIDTH}
        autoPlay={false}
        style={{
          width: '100%',
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
        }}
        customAnimation={animationStyle}
        data={[...chips].reverse()}
        defaultIndex={chips.length - 1}
        scrollAnimationDuration={1000}
        renderItem={({index}) => (
          <ChipDisplayMini goal={goal} chip={chips[index]} />
        )}
      />
    </View>
  );
}

export default ImageStackCarousel;
