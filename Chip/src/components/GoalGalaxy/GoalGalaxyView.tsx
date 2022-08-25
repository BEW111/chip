import React, {useRef} from 'react';
import {View, StyleSheet, Button} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

import Svg, {G, Circle, Text} from 'react-native-svg';
import {scaleLinear} from 'd3';

import {GoalDataPoint, goalGalaxyData} from './GoalGalaxyData';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

const generateAxes = (
  data: GoalDataPoint[],
  GRAPH_WIDTH: number,
  GRAPH_HEIGHT: number,
  MARGIN: number,
  scale: number,
) => {
  const x_min = Math.min(...data.map((point: GoalDataPoint) => point.x));
  const x_max = Math.max(...data.map((point: GoalDataPoint) => point.x));
  const y_min = Math.min(...data.map((point: GoalDataPoint) => point.y));
  const y_max = Math.max(...data.map((point: GoalDataPoint) => point.y));

  const START_X = (GRAPH_WIDTH * (1 - scale)) / 2;
  const END_X = GRAPH_WIDTH - START_X;
  const START_Y = (GRAPH_HEIGHT * (1 - scale)) / 2;
  const END_Y = GRAPH_HEIGHT - START_Y;

  const x = scaleLinear()
    .domain([x_min, x_max])
    .range([START_X + MARGIN, END_X - MARGIN]);
  const y = scaleLinear()
    .domain([y_min, y_max])
    .range([END_Y - MARGIN, START_Y + MARGIN]);

  return {
    x: x,
    y: y,
  };
};

function Galaxy({width, height, margin, scale}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const {x, y} = generateAxes(goalGalaxyData, width, height, margin, scale);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: `translate(10, 10)`,
    };
  });

  return (
    <View>
      <Svg
        width={width}
        height={height}
        stroke="#6231ff"
        style={{backgroundColor: 'blue'}}>
        <G>
          {goalGalaxyData.map(point => (
            <G key={point.x}>
              <AnimatedCircle
                style={animatedStyle}
                // animatedProps={animatedProps}
                cx={x(point.x)}
                cy={y(point.y)}
                r={3}
                stroke="none"
                fill="white"
              />
              <AnimatedText
                style={animatedStyle}
                // animatedProps={animatedProps}
                stroke="gray"
                x={x(point.x)}
                y={y(point.y)}
                textAnchor="middle">
                {point.goal}
              </AnimatedText>
            </G>
          ))}
        </G>
      </Svg>
      <Button
        title="test"
        onPress={() => {
          translateX.value = 500;
          console.log(translateX);
        }}
      />
    </View>
  );
};

export default function GoalGalaxyView({width, height, margin}) {
  // const gestureHandler = useAnimatedGestureHandler({
  //   onStart: (_, ctx) => {
  //     ctx.startX = translateX.value;
  //     ctx.startY = translateY.value;
  //   },
  //   onActive: (event, ctx) => {
  //     translateX.value = ctx.startX + event.translationX;
  //     translateY.value = ctx.startY + event.translationY;
  //   },
  //   onEnd: _ => {
  //     translateX.value = withSpring(0);
  //     translateY.value = withSpring(0);
  //   },
  // });

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      {/* <PanGestureHandler> */}
      <Galaxy width={width} height={height} margin={margin} scale={1} />
      {/* </PanGestureHandler> */}
    </View>
  );
}
