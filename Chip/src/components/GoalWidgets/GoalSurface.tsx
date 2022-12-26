import React, {useState} from 'react';

import {Pressable, View, StyleSheet} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import BlurSurface from '../BlurSurface';
import {styles} from '../../styles';

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

function GoalBadges({goal}) {
  return (
    <View
      style={{
        alignItems: 'flex-start',
      }}>
      <View style={goalBadgeStyles.badge}>
        <Text variant="labelLarge">
          {goal.streak}
          <Icon name="flame-outline" size={18} />
        </Text>
      </View>
    </View>
  );
}

export default function GoalSurface({goal, navigation}) {
  const [pressed, setPressed] = useState(false);
  const surfaceScale = useSharedValue(1);
  const surfaceAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: surfaceScale.value}],
    };
  });

  console.log(goal);

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
          goalId: goal.id,
          routeGoalName: goal.name,
        });
      }}>
      <Animated.View style={surfaceAnimatedStyles}>
        <BlurSurface style={goalSurfaceStyles(pressed).blurSurface}>
          <View style={styles.rowSpaceBetween}>
            <View>
              <GoalBadges goal={goal} />
              <Text style={goalSurfaceStyles(pressed).goalName}>
                {goal.name}
              </Text>
            </View>
            <View style={goalSurfaceStyles(pressed).arrow}>
              <Icon name="chevron-forward-outline" size={24} color="#000" />
            </View>
          </View>
        </BlurSurface>
      </Animated.View>
    </Pressable>
  );
}

const goalSurfaceStyles = (pressed: boolean) =>
  StyleSheet.create({
    blurSurface: {
      opacity: pressed ? 0.5 : 1.0,
      padding: 8,
    },
    goalName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: -2,
    },
    arrow: {justifyContent: 'center'},
  });

const goalBadgeStyles = StyleSheet.create({
  badge: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 3,
    paddingHorizontal: 6,
  },
});
