import React, {useState} from 'react';
import {View} from 'react-native';
import Svg, {
  Rect,
  Text,
  Circle,
  Line,
  G,
  LinearGradient,
  Defs,
  Stop,
} from 'react-native-svg';
import {BlurView} from '@react-native-community/blur';

import {ChipObject} from '../../pages/Analytics';

import LatoRegular from '../../../assets/fonts/Lato-Regular.ttf';

const isToday = (someDate, offset) => {
  const today = new Date();
  today.setDate(today.getDate() - offset);
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export default function DayOccurrenceChart({chips}) {
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  const paddingVertical = 20;
  const paddingHorizontal = 10;
  const dateColumnPadding = 20;
  const timeTextSpace = 50;
  const dateTextSpace = 10;

  const times = ['12am', '6am', '12pm', '6pm', '12am'];
  const dates = [...Array(7).keys()].map(k => {
    let d = new Date();
    d.setDate(d.getDate() - (6 - k));
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    return `${mm}/${dd}`;
  });

  const xSpacing =
    (chartWidth -
      paddingHorizontal * 2 -
      timeTextSpace -
      dateColumnPadding * 2) /
    6;
  const ySpacing = (chartHeight - paddingVertical * 2 - dateTextSpace) / 4;

  const FROM_COLOR = '#ffe4f3';
  const TO_COLOR = '#ffeaea';

  const MARKER_WIDTH = 30;
  const MARKER_HEIGHT = 3;
  const MARKER_COLOR = '#000000';

  const COLUMN_WIDTH = 30;
  const COLUMN_COLOR = 'rgba(245, 166, 198, 0.3)';

  const TEXT_COLOR = 'rgba(68, 10, 23, 0.739)';

  return (
    <View
      style={{flex: 1}}
      onLayout={event => {
        var {width, height} = event.nativeEvent.layout;
        setChartWidth(width);
        setChartHeight(height);
      }}>
      <BlurView
        blurType="light"
        blurAmount={32}
        reducedTransparencyFallbackColor="white"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <Svg height={chartHeight} width={chartWidth}>
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0" stopColor={FROM_COLOR} />
              <Stop offset="1" stopColor={TO_COLOR} />
            </LinearGradient>
          </Defs>
          {/* <Rect width="100%" height="100%" fill="url(#grad)" /> */}
          {dates.map((dateStr, i) => (
            <G key={i}>
              <Rect
                key={i + 100}
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
                key={i + 200}
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
                    key={j + i * 100}
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
                      y * (chartHeight - dateTextSpace - 2 * paddingVertical) -
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
          {times.map((timeStr, i) => (
            <G key={i + 100}>
              <Line
                key={i}
                x1={paddingHorizontal + timeTextSpace}
                x2={chartWidth - paddingHorizontal}
                y1={paddingVertical + i * ySpacing}
                y2={paddingVertical + i * ySpacing}
                stroke={TEXT_COLOR}
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
      </BlurView>
    </View>
  );
}