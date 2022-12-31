import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Ionicons';
import BlurSurface from '../BlurSurface';
import DayOccurrenceChart from '../Charts/DayOccurrenceChart';
import BarChart from '../Charts/BarChart';
import {ChipObject} from '../../types';

const iconMap: {[key: string]: string} = {
  bar: 'bar-chart-outline',
  'day-occurrence': 'calendar-outline',
};

interface ChartWidgetProps {
  chips: ChipObject[];
  chartType: string;
  title: string;
}

const ChartWidget = ({chips, chartType, title}: ChartWidgetProps) => (
  <BlurSurface padding={4}>
    <Text variant="titleSmall" style={localStyles.title}>
      <Icon name={iconMap[chartType]} color={'gray'} size={16} /> {title}
    </Text>
    {chartType === 'bar' ? (
      <BarChart chips={chips} chartHeightProp={224} />
    ) : (
      <DayOccurrenceChart chips={chips} chartHeightProp={224} />
    )}
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

export default ChartWidget;
