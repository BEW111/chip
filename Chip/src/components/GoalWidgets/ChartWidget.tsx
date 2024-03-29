import React from 'react';
import {Text} from 'react-native-paper';
import {styles} from '../../styles';

import Icon from 'react-native-vector-icons/Ionicons';
import BlurSurface from '../BlurSurface';
import DayOccurrenceChart from '../Charts/DayOccurrenceChart';
import BarChart from '../Charts/BarChart';

import {SupabaseChip} from '../../types/chips';

const iconMap: {[key: string]: string} = {
  bar: 'bar-chart-outline',
  'day-occurrence': 'calendar-outline',
};

interface ChartWidgetProps {
  chips: SupabaseChip[];
  chartType: string;
  title: string;
}

const ChartWidget = ({chips, chartType, title}: ChartWidgetProps) => (
  <BlurSurface padding={4}>
    <Text variant="titleSmall" style={styles.widgetTitle}>
      <Icon name={iconMap[chartType]} color={'gray'} size={16} /> {title}
    </Text>
    {chartType === 'bar' ? (
      <BarChart chips={chips} chartHeightProp={224} />
    ) : (
      <DayOccurrenceChart chips={chips} chartHeightProp={224} />
    )}
  </BlurSurface>
);

export default ChartWidget;
