import React, {useState} from 'react';

import {Pressable, View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const subtitleMap = {
  streak: {
    icon: 'flame-outline',
    color: '#FF6B00',
  },
  hint: {
    icon: 'bulb-outline',
  },
  scheduled: {
    icon: 'alarm-outline',
  },
  todo: {
    icon: 'sync-circle-outline',
  },
  completed: {
    icon: 'checkmark-circle-outline',
    color: '#478E00',
  },
};

export default function GoalSurface({
  goalId,
  goalName,
  subtitle,
  subtitleType = 'none',
  navigation,
}) {
  const [pressed, setPressed] = useState(false);
  const surfaceScale = useSharedValue(1);
  const surfaceAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: surfaceScale.value}],
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        setPressed(true);
        surfaceScale.value = withSpring(0.95, {
          damping: 10,
          stiffness: 200,
        });
      }}
      onPressOut={() => {
        setPressed(false);
        surfaceScale.value = withSpring(1, {
          damping: 10,
          stiffness: 200,
        });
      }}
      onPress={() => {
        navigation.navigate('AnalyticsGoalPage', {
          goalId: goalId,
          routeGoalName: goalName,
        });
      }}>
      <Animated.View style={surfaceAnimatedStyles}>
        <BlurView
          style={{
            ...goalSurfaceStyles.blurSurface,
            opacity: pressed ? 0.5 : 1.0,
          }}
          blurType="light"
          blurAmount={32}
          reducedTransparencyFallbackColor="white">
          <View style={{flex: 1}}>
            <Text style={goalSurfaceStyles.goalName}>{goalName}</Text>
            <Text
              style={{fontSize: 18, color: subtitleMap[subtitleType].color}}>
              {subtitleType != 'none' && (
                <>
                  <Icon
                    name={subtitleMap[subtitleType].icon}
                    size={18}
                    color={subtitleMap[subtitleType].color}
                  />
                  <Text> </Text>
                </>
              )}
              {subtitle}
            </Text>
          </View>
          <View style={goalSurfaceStyles.arrow}>
            <Icon name="chevron-forward-outline" size={24} color="#000" />
          </View>
        </BlurView>
      </Animated.View>
    </Pressable>
  );
}

const goalSurfaceStyles = StyleSheet.create({
  blurSurface: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: 12,
    elevation: 0,
    borderRadius: 10,
  },
  goalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: -2,
  },
  arrow: {justifyContent: 'center'},
});
