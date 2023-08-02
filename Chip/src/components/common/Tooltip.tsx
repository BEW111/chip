// Adapted from Paper's actual Tooltip component, for more control over behavior

import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Pressable,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';

import {Text, Portal} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {getTooltipPosition, Measurement} from './tooltipUtils';

type TooltipProps = {
  visible: boolean;
  children: React.ReactElement;
  text: string;
};

const Tooltip = ({visible, children, text}: TooltipProps) => {
  const theme = useTheme();

  const [measurement, setMeasurement] = React.useState({
    children: {},
    tooltip: {},
    measured: false,
  });
  const childrenWrapperRef = React.useRef() as React.MutableRefObject<View>;

  const handleOnLayout = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    childrenWrapperRef.current.measure(
      (_x, _y, width, height, pageX, pageY) => {
        setMeasurement({
          children: {pageX, pageY, height, width},
          tooltip: {...layout},
          measured: true,
        });
      },
    );
  };

  return (
    <>
      {visible && (
        <Portal>
          <View
            onLayout={handleOnLayout}
            style={[
              styles.tooltip,
              {
                backgroundColor: theme.colors.tertiary,
                ...getTooltipPosition(measurement as Measurement, children),
                borderRadius: theme.roundness,
                ...(measurement.measured ? styles.visible : styles.hidden),
              },
            ]}
            testID="tooltip-container">
            <Text
              accessibilityLiveRegion="polite"
              numberOfLines={2}
              selectable={false}
              variant="labelLarge"
              style={{color: theme.colors.onTertiary}}>
              {text}
            </Text>
          </View>
        </Portal>
      )}
      {/* Need the xxPressProps in both places */}
      <Pressable ref={childrenWrapperRef} style={styles.pressContainer}>
        {React.cloneElement(children)}
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 32,
    maxHeight: 32,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  pressContainer: {
    ...(Platform.OS === 'web' && {cursor: 'default'}),
  } as ViewStyle,
});

export default Tooltip;
