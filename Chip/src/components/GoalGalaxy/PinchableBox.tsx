import React from 'react';
import {StyleSheet} from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  RotationGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  PinchGestureHandlerStateChangeEvent,
  RotationGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

import Galaxy from './GoalGalaxy';

const AnimatedGalaxy = Animated.createAnimatedComponent(Galaxy);

const USE_NATIVE_DRIVER = true;

export class PinchableBox extends React.Component<any, any> {
  private panRef = React.createRef<PanGestureHandler>();
  private rotationRef = React.createRef<RotationGestureHandler>();
  private pinchRef = React.createRef<PinchGestureHandler>();
  private baseScale: Animated.Value<number>;
  private pinchScale: Animated.Value<number>;
  private scale: Animated.AnimatedMultiplication;
  private lastScale: number;
  private onPinchGestureEvent: (event: PinchGestureHandlerGestureEvent) => void;
  private rotate: Animated.Value<number>;
  private rotateStr: Animated.AnimatedInterpolation;
  private lastRotate: number;
  private onRotateGestureEvent: (
    event: RotationGestureHandlerGestureEvent,
  ) => void;
  private tilt: Animated.Value<number>;
  private tiltStr: Animated.AnimatedMultiplication;
  private lastTilt: number;
  private onTiltGestureEvent: (event: PanGestureHandlerGestureEvent) => void;

  constructor(props: Record<string, unknown>) {
    super(props);

    /* Pinching */
    this.baseScale = new Animated.Value(1);
    this.pinchScale = new Animated.Value(1);
    this.scale = Animated.multiply(this.baseScale, this.pinchScale);
    this.lastScale = 1;
    this.onPinchGestureEvent = Animated.event(
      [{nativeEvent: {scale: this.pinchScale}}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );

    /* Rotation */
    this.rotate = new Animated.Value(0);
    this.rotateStr = this.rotate.interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
    });
    this.lastRotate = 0;
    this.onRotateGestureEvent = Animated.event(
      [{nativeEvent: {rotation: this.rotate}}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );

    /* Tilt */
    this.tilt = new Animated.Value(0);
    this.tiltStr = this.tilt.interpolate({
      inputRange: [-501, -500, 0, 1],
      outputRange: ['1rad', '1rad', '0rad', '0rad'],
    });
    this.lastTilt = 0;
    this.onTiltGestureEvent = Animated.event(
      [{nativeEvent: {translationY: this.tilt}}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );
  }

  private onRotateHandlerStateChange = (
    event: RotationGestureHandlerStateChangeEvent,
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastRotate += event.nativeEvent.rotation;
      this.rotate.setOffset(this.lastRotate);
      this.rotate.setValue(0);
    }
  };
  private onPinchHandlerStateChange = (
    event: PinchGestureHandlerStateChangeEvent,
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastScale *= event.nativeEvent.scale;
      this.baseScale.setValue(this.lastScale);
      this.pinchScale.setValue(1);
    }
  };
  private onTiltGestureStateChange = (
    event: PanGestureHandlerStateChangeEvent,
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastTilt += event.nativeEvent.translationY;
      this.tilt.setOffset(this.lastTilt);
      this.tilt.setValue(0);
    }
  };

  render() {
    const galaxyProps = useAnimatedProps({
      scale: this.scale,
    });

    return (
      <PanGestureHandler
        ref={this.panRef}
        onGestureEvent={this.onTiltGestureEvent}
        onHandlerStateChange={this.onTiltGestureStateChange}
        minDist={10}
        minPointers={2}
        maxPointers={2}
        avgTouches>
        <Animated.View style={styles.wrapper}>
          <RotationGestureHandler
            ref={this.rotationRef}
            simultaneousHandlers={this.pinchRef}
            onGestureEvent={this.onRotateGestureEvent}
            onHandlerStateChange={this.onRotateHandlerStateChange}>
            <Animated.View style={styles.wrapper}>
              <PinchGestureHandler
                ref={this.pinchRef}
                simultaneousHandlers={this.rotationRef}
                onGestureEvent={this.onPinchGestureEvent}
                onHandlerStateChange={this.onPinchHandlerStateChange}>
                <Animated.View
                  style={(styles.container, {borderColor: 'white'})}
                  collapsable={false}>
                  {/* <Animated.View
                    style={[
                      styles.pinchableImage,
                      {
                        transform: [
                          {perspective: 200},
                          {scale: this.scale},
                          {rotate: this.rotateStr},
                          {rotateX: this.tiltStr},
                        ],
                      },
                    ]}
                  /> */}
                  <AnimatedGalaxy
                    animatedProps={useAnimated}
                    width={400}
                    height={400}
                    margin={50}
                    scale={1}
                    translateX={0}
                    translateY={0}
                  />
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </RotationGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

export default PinchableBox;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pinchableImage: {
    backgroundColor: 'purple',
    width: 250,
    height: 250,
  },
  wrapper: {
    flex: 1,
  },
});
