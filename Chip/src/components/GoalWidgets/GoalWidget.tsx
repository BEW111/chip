import React, {useState, useEffect} from 'react';
import {useAppSelector} from '../../redux/hooks';

import {Pressable, View, StyleSheet} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import {styles} from '../../styles';

// Components
import Icon from 'react-native-vector-icons/Ionicons';
import BlurSurface from '../BlurSurface';
import AvatarDisplay from '../AvatarDisplay';

// Animation
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// Data
import {SupabaseGoal} from '../../types/goals';
import {getSuperstreaksByGoal} from '../../firebase/superstreaks';
import {selectUid} from '../../redux/slices/authSlice';

function GoalBadges({goal}: {goal: SupabaseGoal}) {
  const [superstreaks, setSuperstreaks] = useState([]);
  useEffect(() => {
    getSuperstreaksByGoal(goal.id).then(dataArray =>
      setSuperstreaks(dataArray),
    );
  }, [goal]);

  const currentUser = useAppSelector(selectUid);

  return (
    <View style={styles.row}>
      <View style={goalBadgeStyles.badge}>
        <Text variant="bodyLarge">
          {goal.streak_count}
          <Icon name="flame-outline" size={18} />
        </Text>
      </View>
      <Divider style={styles.dividerHTiny} />
      {superstreaks.map(superstreak => (
        <View
          key={superstreak.users.filter(user => user !== currentUser)[0]}
          style={goalBadgeStyles.badge}>
          <AvatarDisplay
            height={20}
            width={20}
            uid={superstreak.users.filter(user => user !== currentUser)[0]}
          />
          <Divider style={styles.dividerHTiny} />
          <Text variant="bodyLarge">
            {superstreak.streak}
            <Icon name="bonfire-outline" size={18} />
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function GoalWidget({
  goal,
  navigation,
}: {
  goal: SupabaseGoal;
  navigation: any;
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
          goal: goal,
        });
      }}>
      <Animated.View style={surfaceAnimatedStyles}>
        <View style={goalSurfaceStyles(pressed).emojiViewBlur}>
          <Text variant="displayLarge">
            {goal.emoji}
            {goal.emoji}
            {goal.emoji}
            {goal.emoji}
          </Text>
        </View>
        <BlurSurface style={goalSurfaceStyles(pressed).blurSurface}>
          <View style={goalSurfaceStyles(pressed).emojiView}>
            <Text variant="displayLarge">
              {goal.emoji}
              {goal.emoji}
              {goal.emoji}
              {goal.emoji}
            </Text>
          </View>
          <View style={styles.rowSpaceBetween}>
            <View style={goalSurfaceStyles(pressed).primaryContentsWrapper}>
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
      fontSize: 28,
      fontWeight: 'bold',
    },
    primaryContentsWrapper: {
      paddingLeft: 2,
    },
    arrow: {justifyContent: 'center'},
    emojiView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.3,
      paddingTop: 8,
      paddingLeft: 8,
    },
    emojiViewBlur: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.5,
      paddingTop: 8,
      paddingLeft: 8,
    },
  });

const goalBadgeStyles = StyleSheet.create({
  badge: {
    backgroundColor: '#ffffff8f',
    paddingVertical: 1,
    paddingLeft: 4,
    paddingRight: 2,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
