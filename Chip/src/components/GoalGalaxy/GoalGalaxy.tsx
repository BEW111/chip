import React from 'react';

import Svg, {G, Circle, Text} from 'react-native-svg';
import {scaleLinear} from 'd3';
import Animated from 'react-native-reanimated';

import {GoalDataPoint, goalGalaxyData} from './GoalGalaxyData';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedG = Animated.createAnimatedComponent(G);
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

// export default class Galaxy extends React.Component<
//   {
//     width: number;
//     height: number;
//     margin: number;
//     translateX: number;
//     translateY: number;
//     scale: number;
//   },
//   {}
// > {
//   constructor(props: any) {
//     super(props);
//   }

//   render() {
//     const {width, height, margin, translateX, translateY, scale} = this.props;

//     const {x, y} = generateAxes(goalGalaxyData, width, height, margin, scale);

//     return (
//       <AnimatedSvg
//         width={width}
//         height={height}
//         stroke="#6231ff"
//         style={{backgroundColor: 'blue'}}>
//         <AnimatedG>
//           {goalGalaxyData.map(point => (
//             <AnimatedG key={point.x}>
//               <AnimatedCircle
//                 cx={x(point.x) + translateX}
//                 cy={y(point.y) + translateY}
//                 r={3}
//                 stroke="none"
//                 fill="white"
//               />
//               <AnimatedText
//                 stroke="gray"
//                 x={x(point.x) + translateX}
//                 y={y(point.y) + translateY}
//                 textAnchor="middle">
//                 {point.goal}
//               </AnimatedText>
//             </AnimatedG>
//           ))}
//         </AnimatedG>
//       </AnimatedSvg>
//     );
//   }
// }

export default function Galaxy({
  width,
  height,
  margin,
  scale,
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const {x, y} = generateAxes(goalGalaxyData, width, height, margin, scale);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  const springParams = {
    damping: 10,
    mass: 0.12,
    stiffness: 150,
  };

  return (
    <AnimatedSvg
      width={width}
      height={height}
      stroke="#6231ff"
      style={{backgroundColor: 'blue'}}>
      <AnimatedG>
        {goalGalaxyData.map(point => (
          <AnimatedG key={point.x}>
            <AnimatedCircle
              cx={x(point.x) + translateX}
              cy={y(point.y) + translateY}
              r={3}
              stroke="none"
              fill="white"
            />
            <AnimatedText
              stroke="gray"
              x={x(point.x) + translateX}
              y={y(point.y) + translateY}
              textAnchor="middle">
              {point.goal}
            </AnimatedText>
          </AnimatedG>
        ))}
      </AnimatedG>
    </AnimatedSvg>
  );
}
