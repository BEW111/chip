import React, {useState, useEffect} from 'react';

import {Pressable, View, StyleSheet} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import BlurSurface from '../BlurSurface';
import {styles} from '../../styles';
import {getSuperstreaks} from '../../firebase/superstreaks';
import {useSelector} from 'react-redux';
import {selectUid} from '../../redux/authSlice';

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
  const [superstreaks, setSuperstreaks] = useState([]);
  useEffect(() => {
    getSuperstreaks(goal.id).then(dataArray => setSuperstreaks(dataArray));
  }, [goal]);

  const currentUser = useSelector(selectUid);

  return (
    <View style={styles.row}>
      <View style={goalBadgeStyles.badge}>
        <Text variant="bodyLarge">
          {goal.streak}
          <Icon name="flame-outline" size={18} />
        </Text>
      </View>
      <Divider style={styles.dividerHTiny} />
      {superstreaks.map(superstreak => (
        <View
          key={superstreak.users.filter(user => user !== currentUser)[0]}
          style={goalBadgeStyles.badge}>
          <Text variant="bodyLarge">
            {superstreak.streak}
            <Icon name="bonfire-outline" size={18} />
            {/* {superstreak.users.filter(user => user !== currentUser)[0]} */}
          </Text>
        </View>
      ))}
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
          goal: goal,
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
    backgroundColor: '#FFFB',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 50,
  },
});
