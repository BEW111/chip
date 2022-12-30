import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Ionicons';
import BlurSurface from '../BlurSurface';
import DayOccurrenceChart from '../Charts/DayOccurrenceChart';

const DayOccurrenceChartWidget = ({chips}) => (
  <BlurSurface padding={4}>
    <Text variant="titleSmall" style={localStyles.title}>
      <Icon name="calendar-outline" color={'gray'} size={16} /> Habit
      occurrences
    </Text>
    <DayOccurrenceChart chips={chips} chartHeightProp={224} />
  </BlurSurface>
);

const localStyles = StyleSheet.create({
  title: {
    paddingLeft: 10,
    paddingTop: 4,
    color: 'gray',
    textTransform: 'uppercase',
  },
});

export default DayOccurrenceChartWidget;
