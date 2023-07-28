import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import Svg, {
  Rect,
  Text,
  Line,
  G,
  LinearGradient,
  Defs,
  Stop,
  Path,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {SupabaseChip} from '../../types/chips';

import LatoRegular from '../../../assets/fonts/Lato-Regular.ttf';
import {styles} from '../../styles';
import {
  COLUMN_COLOR,
  COLUMN_WIDTH,
  FROM_COLOR,
  GRIDLINE_COLOR,
  BAR_COLOR,
  TEXT_COLOR,
  TO_COLOR,
} from '../../chartParams';

const AnimatedPath = Animated.createAnimatedComponent(Path);

function linspace(start: number, stop: number, num: number, endpoint = true) {
  const div = endpoint ? num - 1 : num;
  const step = (stop - start) / div;
  return Array.from({length: num}, (_, i) => start + step * i);
}

const isToday = (someDate, offset) => {
  const today = new Date();
  today.setDate(today.getDate() - offset);
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

const getDailyAmount = (chips: SupabaseChip[], day: number) =>
  chips
    .filter((chip: SupabaseChip) => isToday(new Date(chip.created_at), 6 - day))
    .reduce(
      (accumulator: number, chip: SupabaseChip) =>
        accumulator + (chip?.amount ? chip.amount : 0),
      0,
    );

const getMaxDailyAmount = (chips: SupabaseChip[]) =>
  Math.max(...[...Array(7).keys()].map(i => getDailyAmount(chips, i)));

const getNearestCleanNumber = (x: number) => {
  if (x === 0) {
    return 0;
  }
  const cleanNumbers = [1, 1.25, 2.5, 5, 7.5, 10];
  const amt = Math.pow(10, Math.floor(Math.log10(x)));
  const dec = x / amt;
  const roundedUp = cleanNumbers.filter(n => dec < n)[0];
  return roundedUp * amt;
};

const AnimatedRoundedRect = ({x, y, width, height, roundness, fill}) => {
  const completion = useSharedValue(0.1); // animate from 0.1 to 1
  const animatedProps = useAnimatedProps(() => {
    const path = `M${0},${height}
    v${roundness - height * completion.value}
    q0,${-roundness} ${roundness},${-roundness}
    h${width - 2 * roundness}
    q${roundness},0 ${roundness},${roundness}
    v${height * completion.value - roundness}
    z
    `;
    return {
      d: path,
    };
  });

  useEffect(() => {
    completion.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  if (roundness > height || roundness > width || !height || !width) {
    return <></>;
  } else {
    return (
      <AnimatedPath
        animatedProps={animatedProps}
        x={x}
        y={y}
        d={`M${0},${height}
                v${roundness - height}
                q0,${-roundness} ${roundness},${-roundness}
                h${width - 2 * roundness}
                q${roundness},0 ${roundness},${roundness}
                v${height - roundness}
                z
                `}
        fill={fill}
      />
    );
  }
};

type BarChartProps = {
  chips: SupabaseChip[];
  chartHeightProp: number;
};

export default function BarChart({chips, chartHeightProp}: BarChartProps) {
  // Calculate chip-related data
  const maxDailyAmount = getMaxDailyAmount(chips);
  const dailyAmounts = [...Array(7).keys()].map(i => getDailyAmount(chips, i));

  // Calculated width and height of the chart
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  // Spacing params
  const paddingVertical = 20; // for the axes of the chart itself
  const paddingHorizontal = 10; // for the axes of the chart itself
  const dateColumnPadding = 15;
  const ytickerTextSpace = 40; // padding between the y-axis text and chart
  const dateTextSpace = 10; // padding between the x-axis text and chart

  // Text items for axes
  const numYtickers = 6;
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
      ytickerTextSpace -
      dateColumnPadding * 2) /
    (dates.length - 1);
  const ySpacing =
    (chartHeight - paddingVertical * 2 - dateTextSpace) / (numYtickers - 1);
  const barMaxHeight = chartHeight - paddingVertical * 2 - dateTextSpace; // height of the bar section of the chart in svg coords

  // Calculating bar heights and ticker values
  let ymax = getNearestCleanNumber(maxDailyAmount); // max height in "habit" coordinates
  ymax = ymax || 1.25;
  const barHeights = dailyAmounts.map(
    dailyAmount => (dailyAmount * barMaxHeight) / ymax,
  );
  const ytickers = linspace(ymax, 0, numYtickers);

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
                <Rect // background
                  key={i + dates.length} // arbitrary key, just needs to be unique
                  x={
                    paddingHorizontal +
                    ytickerTextSpace +
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
                <Text // ticker
                  key={i + dates.length * 2} // arbitrary key, just needs to be unique
                  font={LatoRegular}
                  stroke="none"
                  fill={TEXT_COLOR}
                  fontSize={14}
                  x={
                    paddingHorizontal +
                    ytickerTextSpace +
                    dateColumnPadding +
                    xSpacing * i
                  }
                  y={chartHeight - dateTextSpace + 3}
                  dy={18 * -0.25}
                  textAnchor="middle">
                  {dateStr}
                </Text>
                <AnimatedRoundedRect
                  x={
                    paddingHorizontal +
                    ytickerTextSpace +
                    dateColumnPadding -
                    COLUMN_WIDTH / 2 +
                    xSpacing * i
                  }
                  y={paddingVertical + barMaxHeight - barHeights[i]}
                  width={COLUMN_WIDTH}
                  height={barHeights[i]}
                  roundness={10}
                  fill={BAR_COLOR}
                />
              </G>
            ))}
            {/* Y-AXIS */}
            {ytickers.map((timeStr, i) => (
              <G key={i + 100}>
                <Line
                  key={i}
                  x1={paddingHorizontal + ytickerTextSpace}
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
