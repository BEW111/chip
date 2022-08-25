import React from 'react';
import {ScrollView, View} from 'react-native';

import Svg, {G, Circle, Text} from 'react-native-svg';
import {scaleLinear} from 'd3';

import {GoalDataPoint, goalGalaxyData} from './GoalGalaxyData';

const makeGraph = (
  data: GoalDataPoint[],
  GRAPH_WIDTH,
  GRAPH_HEIGHT,
  MARGIN,
) => {
  const x_min = Math.min(...data.map((point: GoalDataPoint) => point.x));
  const x_max = Math.max(...data.map((point: GoalDataPoint) => point.x));
  const y_min = Math.min(...data.map((point: GoalDataPoint) => point.y));
  const y_max = Math.max(...data.map((point: GoalDataPoint) => point.y));

  const x = scaleLinear()
    .domain([x_min, x_max])
    .range([MARGIN, GRAPH_WIDTH - MARGIN]);
  const y = scaleLinear()
    .domain([y_min, y_max])
    .range([GRAPH_HEIGHT - MARGIN, MARGIN]);

  const points = data.map(point => (
    <G key={point.x}>
      <Circle
        cx={x(point.x)}
        cy={y(point.y)}
        r={3}
        stroke="none"
        fill="white"
      />
      <Text stroke="gray" x={x(point.x)} y={y(point.y)} textAnchor="middle">
        {point.goal}
      </Text>
    </G>
  ));

  return points;
};

export default function GoalGalaxyView({width, height, margin}) {
  const points = [makeGraph(goalGalaxyData, width, height, margin)];

  return (
    <View
      style={{
        width: '100%',
        height: '100%',  
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <ScrollView>
        <Svg
          width={width}
          height={height}
          stroke="#6231ff"
          style={{backgroundColor: 'black'}}>
          <G>{points}</G>
        </Svg>
      </ScrollView>
    </View>
  );
}
