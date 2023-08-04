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

  const tooltipPosition = getTooltipPosition(
    measurement as Measurement,
    children,
  );

  return (
    <>
      {visible && (
        <Portal>
          <View
            // onLayout={handleOnLayout}
            style={[
              styles.triangleWrapper,
              {
                top: tooltipPosition.top,
                left: measurement.children.pageX,
                width: measurement.children.width,
                borderRadius: theme.roundness,
                ...(measurement.measured ? styles.visible : styles.hidden),
              },
            ]}
            testID="tooltip-container">
            <Triangle
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                borderBottomColor: theme.colors.tertiary,
              }}
            />
          </View>
          <View
            onLayout={handleOnLayout}
            style={[
              styles.tooltip,
              {
                backgroundColor: theme.colors.tertiary,
                ...tooltipPosition,
                borderRadius: theme.roundness,
                ...(measurement.measured ? styles.visible : styles.hidden),
              },
            ]}
            testID="tooltip-container">
            <Text
              accessibilityLiveRegion="polite"
              selectable={false}
              variant="labelLarge"
              style={{color: theme.colors.onTertiary}}>
              {text}
            </Text>
          </View>
          {/* <View
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {
                ...tooltipPosition,
                position: 'absolute',
                backgroundColor: 'purple',
                height: 10,
                alignSelf: 'flex-start',
                justifyContent: 'center',
              },
            ]}>

          </View> */}
        </Portal>
      )}
      {/* Need the xxPressProps in both places */}
      <Pressable ref={childrenWrapperRef} style={styles.pressContainer}>
        {React.cloneElement(children)}
      </Pressable>
    </>
  );
};

const Triangle = props => {
  return <View style={[styles.triangle, props.style]} />;
};

const styles = StyleSheet.create({
  triangleWrapper: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 10,
  },
  tooltip: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    // height: 32,
    // maxHeight: 32,
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
  triangle: {
    alignSelf: 'center',
    justifyContent: 'center',

    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',

    position: 'absolute',
  },
});

export default Tooltip;
