/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {StyleSheet, FlatList, View, Pressable} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import {Surface, Text, IconButton} from 'react-native-paper';
import ChipDisplayMini from '../GoalDetail/ChipDisplayMini';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ITEM_WIDTH = 144;

export default function ImageCarouselWidget({navigation, chips}) {
  const transX = useSharedValue(0);
  const [widgetWidth, setWidgetWidth] = useState(0);

  const renderItem = useCallback(
    ({item, index}) => {
      return <ChipDisplay index={index} chip={item} transX={transX} />;
    },
    [transX],
  );

  const keyExtractor = useCallback((item, index) => `${item.id}-${index}`, []);
  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      transX.value = event.contentOffset.x + (widgetWidth / 2 - ITEM_WIDTH / 2);
    },
  });

  return (
    <Surface
      style={{
        width: '100%',
        elevation: 0,
        borderRadius: 10,
        backgroundColor: '#FFEEF8',
        overflow: 'hidden',
      }}
      onLayout={event => {
        var {width} = event.nativeEvent.layout;
        setWidgetWidth(width);
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
              padding: 16,
              paddingTop: 12,
            }}>
            Latest chips
          </Text>
          <IconButton
            icon={'search-circle-outline'}
            size={36}
            style={{margin: -2}}
            color={'black'}
            onPress={() => console.log('test')}
          />
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <AnimatedFlatList
            onScroll={scrollHandler}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.list}
            data={chips}
            decelerationRate="normal"
            snapToInterval={ITEM_WIDTH}
            scrollEventThrottle={16}
            pagingEnabled
            snapToAlignment="center"
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            keyExtractor={keyExtractor}
            CellRendererComponent={({children, index, style, ...props}) => {
              const cellStyle = [style, {zIndex: chips.length - index}];

              return (
                <View style={cellStyle} index={index} {...props}>
                  {children}
                </View>
              );
            }}
            contentContainerStyle={{
              display: 'flex',
            }}
            inverted
          />
        </View>
      </View>
    </Surface>
  );
}

const ChipDisplay = ({index, chip, transX}) => {
  const udv = useDerivedValue(() => {
    if (
      transX.value >= (index - 3) * ITEM_WIDTH &&
      transX.value <= (index + 3) * ITEM_WIDTH
    ) {
      return transX.value;
    } else if (transX.value < (index - 3) * ITEM_WIDTH) {
      return null;
    } else if (transX.value > (index + 3) * ITEM_WIDTH) {
      return null;
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation(udv, index),
      transform: [
        {scale: scaleAnimation(udv, index)},
        {translateX: translateXAnimation(udv, index)},
        {translateY: translateYAnimation(udv, index)},
      ],
      zIndex: zIndexAnimation(udv, index),
    };
  });
  return (
    <Animated.View style={[styles.box, animatedStyle]}>
      <ChipDisplayMini
        key={chip.key}
        verb={chip.description}
        photo={chip.photo}
        // date={date}
        // time={time}
      />
    </Animated.View>
  );
};

const translateXAnimation = (udv, index) => {
  'worklet';

  return udv.value === null
    ? 0
    : interpolate(
        udv.value,
        [
          (index - 3) * ITEM_WIDTH,
          (index - 2) * ITEM_WIDTH,
          (index - 1) * ITEM_WIDTH,
          index * ITEM_WIDTH,
          (index + 1) * ITEM_WIDTH,
          (index + 2) * ITEM_WIDTH,
          (index + 3) * ITEM_WIDTH,
        ],
        [
          ITEM_WIDTH * 3,
          ITEM_WIDTH * 1.5,
          ITEM_WIDTH * 0.5,
          0,
          -ITEM_WIDTH * 0.5,
          -ITEM_WIDTH * 1.5,
          -ITEM_WIDTH * 3,
        ],
        Extrapolate.CLAMP,
      );
};

const translateYAnimation = (udv, index) => {
  'worklet';

  return udv.value === null
    ? 0
    : interpolate(
        udv.value,
        [
          (index - 3) * ITEM_WIDTH,
          (index - 2) * ITEM_WIDTH,
          (index - 1) * ITEM_WIDTH,
          index * ITEM_WIDTH,
          (index + 1) * ITEM_WIDTH,
          (index + 2) * ITEM_WIDTH,
          (index + 3) * ITEM_WIDTH,
        ],
        [
          ITEM_WIDTH * 0.5,
          ITEM_WIDTH * 0.25,
          ITEM_WIDTH * 0.1,
          0,
          ITEM_WIDTH * 0.1,
          ITEM_WIDTH * 0.25,
          ITEM_WIDTH * 0.5,
        ],
        Extrapolate.CLAMP,
      );
};

const scaleAnimation = (udv, index) => {
  'worklet';

  return udv.value === null
    ? 0
    : interpolate(
        udv.value,
        [
          (index - 3) * ITEM_WIDTH,
          (index - 2) * ITEM_WIDTH,
          (index - 1) * ITEM_WIDTH,
          (index + 0) * ITEM_WIDTH,
          (index + 1) * ITEM_WIDTH,
          (index + 2) * ITEM_WIDTH,
          (index + 3) * ITEM_WIDTH,
        ],
        [0.5, 0.7, 0.9, 1, 0.9, 0.7, 0.5],
        Extrapolate.CLAMP,
      );
};

const zIndexAnimation = (udv, index) => {
  'worklet';

  return udv.value === null
    ? 0
    : interpolate(
        udv.value,
        [
          (index - 3) * ITEM_WIDTH,
          (index - 2) * ITEM_WIDTH,
          (index - 1) * ITEM_WIDTH,
          (index + 0) * ITEM_WIDTH,
          (index + 1) * ITEM_WIDTH,
          (index + 2) * ITEM_WIDTH,
          (index + 3) * ITEM_WIDTH,
        ],
        [4, 6, 8, 10, 8, 6, 4],
        Extrapolate.CLAMP,
      );
};

const opacityAnimation = (udv, index) => {
  'worklet';

  return udv.value === null
    ? 0
    : interpolate(
        udv.value,
        [
          (index - 3) * ITEM_WIDTH,
          (index - 2) * ITEM_WIDTH,
          (index - 1) * ITEM_WIDTH,
          index * ITEM_WIDTH,
          (index + 1) * ITEM_WIDTH,
          (index + 2) * ITEM_WIDTH,
          (index + 3) * ITEM_WIDTH,
        ],
        [0.5, 0.8, 0.9, 1, 0.9, 0.8, 0.5],
        Extrapolate.CLAMP,
      );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
  },
  listContainer: {
    width: '100%',
  },
  list: {
    width: '100%',
  },
  box: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
  },
});