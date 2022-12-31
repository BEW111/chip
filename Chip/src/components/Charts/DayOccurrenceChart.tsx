import React, {useState} from 'react';
import {View} from 'react-native';
import Svg, {
  Rect,
  Text,
  Line,
  G,
  LinearGradient,
  Defs,
  Stop,
} from 'react-native-svg';

import {ChipObject} from '../../types';

import LatoRegular from '../../../assets/fonts/Lato-Regular.ttf';
import {styles} from '../../styles';
import {
  COLUMN_COLOR,
  COLUMN_WIDTH,
  FROM_COLOR,
  GRIDLINE_COLOR,
  MARKER_COLOR,
  MARKER_HEIGHT,
  MARKER_WIDTH,
  TEXT_COLOR,
  TO_COLOR,
} from '../../chartParams';

const isToday = (someDate, offset) => {
  const today = new Date();
  today.setDate(today.getDate() - offset);
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

export default function DayOccurrenceChart({chips, chartHeightProp}) {
  // Calculated width and height of the chart
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  // Spacing params
  const paddingVertical = 20; // for the axes of the chart itself
  const paddingHorizontal = 10; // for the axes of the chart itself
  const dateColumnPadding = 15;
  const timeTextSpace = 50; // padding between the y-axis text and chart
  const dateTextSpace = 10; // padding between the x-axis text and chart

  // Text items for axes
  const times = ['12am', '6am', '12pm', '6pm', '12am'];
  const dates = [...Array(7).keys()].map(k => {
    let d = new Date();
    d.setDate(d.getDate() - (6 - k));
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    return `${mm}/${dd}`;
  });

  // Calculating spacing between columns and rows
  const xSpacing =
    (chartWidth -
      paddingHorizontal * 2 -
      timeTextSpace -
      dateColumnPadding * 2) /
    (dates.length - 1);
  const ySpacing =
    (chartHeight - paddingVertical * 2 - dateTextSpace) / (times.length - 1);

  return (
    <View style={{height: chartHeightProp}}>
      <View style={styles.full}>
        <View
          style={styles.expand}
          onLayout={event => {
            var {width, height} = event.nativeEvent.layout;
            setChartWidth(width);
            setChartHeight(height);
          }}>
          <Svg height={chartHeight} width={chartWidth}>
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0" stopColor={FROM_COLOR} />
                <Stop offset="1" stopColor={TO_COLOR} />
              </LinearGradient>
            </Defs>
            {/* X-AXIS AND DATA POINTS */}
            {dates.map((dateStr, i) => (
              <G key={i}>
                <Rect
                  key={i + dates.length} // arbitrary key, just needs to be unique
                  x={
                    paddingHorizontal +
                    timeTextSpace +
                    dateColumnPadding -
                    COLUMN_WIDTH / 2 +
                    xSpacing * i
                  }
                  width={COLUMN_WIDTH}
                  y={paddingVertical}
                  height={chartHeight - paddingVertical * 2 - dateTextSpace}
                  stroke="none"
                  fill={COLUMN_COLOR}
                />
                <Text
                  key={i + dates.length * 2} // arbitrary key, just needs to be unique
                  font={LatoRegular}
                  stroke="none"
                  fill={TEXT_COLOR}
                  fontSize={14}
                  x={
                    paddingHorizontal +
                    timeTextSpace +
                    dateColumnPadding +
                    xSpacing * i
                  }
                  y={chartHeight - dateTextSpace + 3}
                  dy={18 * -0.25}
                  textAnchor="middle">
                  {dateStr}
                </Text>
                {chips
                  .filter((chip: ChipObject) =>
                    isToday(chip.timeSubmitted.toDate(), 6 - i),
                  )
                  .map((chip: ChipObject) => {
                    let d = chip.timeSubmitted.toDate();
                    return (
                      (d.getHours() +
                        d.getMinutes() / 60 +
                        d.getSeconds() / 3600) /
                      24
                    );
                  })
                  .map((y, j) => (
                    <Rect
                      key={j + i * 100} // arbitrary key, just needs to be unique
                      x={
                        paddingHorizontal +
                        timeTextSpace +
                        dateColumnPadding +
                        xSpacing * i -
                        MARKER_WIDTH / 2
                      }
                      width={MARKER_WIDTH}
                      y={
                        paddingVertical +
                        y *
                          (chartHeight - dateTextSpace - 2 * paddingVertical) -
                        MARKER_HEIGHT / 2
                      }
                      height={MARKER_HEIGHT}
                      stroke="none"
                      fill={MARKER_COLOR}
                      rx={2}
                    />
                  ))}
              </G>
            ))}
            {/* Y-AXIS */}
            {times.map((timeStr, i) => (
              <G key={i + 100}>
                <Line
                  key={i}
                  x1={paddingHorizontal + timeTextSpace}
                  x2={chartWidth - paddingHorizontal}
                  y1={paddingVertical + i * ySpacing}
                  y2={paddingVertical + i * ySpacing}
                  stroke={GRIDLINE_COLOR}
                  strokeLinecap="round"
                  strokeDasharray="5, 3"
                />
                <Text
                  key={i + 100}
                  font={LatoRegular}
                  stroke="none"
                  fill={TEXT_COLOR}
                  fontSize={18}
                  x={paddingHorizontal}
                  y={paddingVertical + i * ySpacing + 18 / 2}
                  dy={18 * -0.25}
                  textAnchor="start">
                  {timeStr}
                </Text>
              </G>
            ))}
          </Svg>
        </View>
      </View>
    </View>
  );
}
