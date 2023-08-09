import React, {useState, useEffect} from 'react';

// Components
import {Dimensions, View, LogBox, ColorValue, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import backgroundImage from './assets/background.png';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Providers
import {Provider as PaperProvider, Text} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Auth
import {supabase} from './src/supabase/supabase';
import {Session} from '@supabase/supabase-js';
import supabaseApi from './src/redux/supabaseApi';

import {useAppDispatch, useAppSelector} from './src/redux/hooks';

import {store} from './src/redux/store';
import {updateUid} from './src/redux/slices/authSlice';

// Notifications
import {requestNotificationsPermission} from './src/notifications/reminders';
import {
  onLogInOneSignal,
  onLogOutOneSignal,
} from './src/notifications/onesignal';

// Onboarding pages
import Onboarding from './src/pages/SignedOut/Onboarding';
import OnboardingRegister from './src/pages/SignedOut/OnboardingRegister';
import SignIn from './src/pages/SignedOut/SignIn';

// Main pages
import Home from './src/pages/Home';
import Friends from './src/pages/Friends';
import Track from './src/pages/Track';
import Goals from './src/pages/Goals/GoalsPage';
import Settings from './src/pages/Settings';

// Styling
import theme from './src/theme';
import {styles} from './src/styles';
import {
  selectInTutorial,
  selectTutorialStage,
} from './src/redux/slices/tutorialSlice';

// Animation
import Animated, {FadeIn, FadeInDown, Easing} from 'react-native-reanimated';

// TODO: temp fix
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Warning: Overriding previous layout animation with new one before the first began',
  '@supabase/gotrue-js: Stack guards not supported in this environment. Generally not an issue but may point to a very conservative transpilation environment (use ES2017 or above) that implements async/await with generators, or this is a JavaScript engine that does not support async/await stack traces.',
]);

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

type VariableIconProps = {
  focused: boolean;
  iconName: string;
  color?: number | ColorValue | undefined;
  disabled: boolean;
};
const VariableIcon = ({
  focused,
  iconName,
  color,
  disabled,
}: VariableIconProps) => {
  return (
    <Animated.View
      style={localStyles({color, disabled}).tabIcon}
      key={`${iconName}-icon-view`}
      entering={FadeIn.duration(700).easing(Easing.poly(5))}>
      <Icon
        disabled
        name={focused ? iconName : `${iconName}-outline`}
        color={disabled ? theme.colors.surfaceDisabled : color}
        size={28}
      />
    </Animated.View>
  );
};

type VariableTextProps = {
  text: string;
  color?: number | ColorValue | undefined;
  disabled: boolean;
};
const VariableText = ({text, color, disabled}: VariableTextProps) => {
  return (
    <Animated.View
      style={localStyles({color, disabled}).tabIcon}
      key={`${text}-text-view`}
      entering={FadeIn.duration(700).easing(Easing.poly(5))}>
      <Text
        variant="labelSmall"
        style={localStyles({color, disabled}).tabLabel}>
        {text}
      </Text>
    </Animated.View>
  );
};

function MainTabs() {
  const insets = useSafeAreaInsets();
  // const isNewUser = useSelector(selectNewlyCreated);

  // Only want to get the message token and check for permissions when we're logged in
  useEffect(() => {
    requestNotificationsPermission();
  }, []);

  // Tutorial state for disabling tabs
  const inTutorial = useAppSelector(selectInTutorial);
  const tutorialStage = useAppSelector(selectTutorialStage);
  const disabledTabsMap =
    tutorialStage === null
      ? {
          home: false,
          friends: false,
          track: false,
          goals: false,
          you: false,
        }
      : tutorialStage.startsWith('goals')
      ? {
          home: true,
          friends: true,
          track: true,
          goals: false,
          you: true,
        }
      : tutorialStage.startsWith('track')
      ? {
          home: true,
          friends: true,
          track: false,
          goals: true,
          you: true,
        }
      : tutorialStage.startsWith('friends')
      ? {
          home: true,
          friends: false,
          track: false,
          goals: false,
          you: true,
        }
      : {
          home: false,
          friends: false,
          track: false,
          goals: false,
          you: false,
        };

  // Would really like to figure out how to make this code cleaner,
  // and somehow make each Tab.Screen shorter (I couldn't figure out how to make
  // a custom component)
  return (
    <View style={styles.expand}>
      <FastImage source={backgroundImage} style={styles.absoluteFull} />
      <View style={styles.absoluteFull}>
        <Tab.Navigator
          tabBarPosition="bottom"
          initialLayout={{
            width: Dimensions.get('window').width,
          }}
          initialRouteName={
            tutorialStage?.startsWith('goals') ? 'Goals' : 'Track'
          }
          style={{
            paddingBottom: insets.bottom,
          }}
          screenOptions={{
            tabBarActiveTintColor: '#e91e63',
            tabBarStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
              paddingBottom: 0,
            },
            tabBarIndicatorStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.0)',
            },
            swipeEnabled: !inTutorial,
          }}>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: ({color}) => (
                <VariableText
                  text="Home"
                  color={color}
                  disabled={disabledTabsMap.home}
                />
              ),
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="home"
                  focused={focused}
                  color={color}
                  disabled={disabledTabsMap.home}
                />
              ),
            }}
            listeners={{
              tabPress: e => {
                if (disabledTabsMap.home) {
                  e.preventDefault();
                }
              },
            }}
          />
          <Tab.Screen
            name="Friends"
            component={Friends}
            options={{
              tabBarLabel: ({color}) => (
                <VariableText
                  text="Friends"
                  color={color}
                  disabled={disabledTabsMap.friends}
                />
              ),
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="people-circle"
                  focused={focused}
                  color={color}
                  disabled={disabledTabsMap.friends}
                />
              ),
            }}
            listeners={{
              tabPress: e => {
                if (disabledTabsMap.friends) {
                  e.preventDefault();
                }
              },
            }}
          />
          <Tab.Screen
            name="Track"
            component={Track}
            options={{
              tabBarLabel: ({color}) => (
                <VariableText
                  text="Track goal"
                  color={color}
                  disabled={disabledTabsMap.track}
                />
              ),
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="camera"
                  focused={focused}
                  color={color}
                  disabled={disabledTabsMap.track}
                />
              ),
            }}
            listeners={{
              tabPress: e => {
                if (disabledTabsMap.track) {
                  e.preventDefault();
                }
              },
            }}
          />
          <Tab.Screen
            name="Goals"
            component={Goals}
            options={{
              tabBarLabel: ({color}) => (
                <VariableText
                  text="Goals"
                  color={color}
                  disabled={disabledTabsMap.goals}
                />
              ),
              tabBarLabelStyle: {fontSize: 12},
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="stats-chart"
                  focused={focused}
                  color={color}
                  disabled={disabledTabsMap.goals}
                />
              ),
            }}
            listeners={{
              tabPress: e => {
                if (disabledTabsMap.goals) {
                  e.preventDefault();
                }
              },
            }}
          />
          <Tab.Screen
            name="You"
            component={Settings}
            options={{
              tabBarLabel: ({color}) => (
                <VariableText
                  text="You"
                  color={color}
                  disabled={disabledTabsMap.you}
                />
              ),
              tabBarLabelStyle: {fontSize: 12},
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="person"
                  focused={focused}
                  color={color}
                  disabled={disabledTabsMap.you}
                />
              ),
            }}
            listeners={{
              tabPress: e => {
                if (disabledTabsMap.you) {
                  e.preventDefault();
                }
              },
            }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

// Main app component
function Main() {
  const dispatch = useAppDispatch();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session: newSession}}) => {
      setSession(newSession);
    });

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      dispatch(updateUid(newSession?.user.id));
      console.log(`[Main] Updated UID to ${newSession?.user.id}`);
      dispatch(
        supabaseApi.util.invalidateTags([
          'Chip',
          'Friendship',
          'Goal',
          'Profile',
          'Story',
          'Costreak',
        ]),
      );

      // If we've logged in
      if (newSession?.user.id) {
        onLogInOneSignal(newSession?.user.id);
      } else {
        onLogOutOneSignal();
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (session && session.user) {
    return (
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen
            name="OnboardingRegister"
            component={OnboardingRegister}
          />
          <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

// Wrappers around main component
export default function App() {
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        {/* Note that Paper may have modals, so we need to have the gesture handler above that */}
        <GestureHandlerRootView style={styles.expand}>
          <PaperProvider
            theme={theme}
            settings={{
              icon: props => <Icon {...props} />,
            }}>
            <Main />
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </StoreProvider>
  );
}

// Local styles
type LocalStylesGeneratorType = {
  color: ColorValue | number | string | undefined;
  disabled: boolean;
};
const localStyles = (props: LocalStylesGeneratorType) =>
  StyleSheet.create({
    tabLabel: {
      color: props.disabled ? 'gray' : props.color,
      textTransform: 'none',
      marginBottom: -10,
    },
    tabIcon: {
      alignItems: 'center',
      margin: -2, // This is for centering the icon correctly
    },
  });
