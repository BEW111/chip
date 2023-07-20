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

import {useAppDispatch, useAppSelector} from './src/redux/hooks';

import {store} from './src/redux/store';
import {
  selectInitializing,
  selectUser,
  updateInitializing,
  updateUid,
  updateUser,
  updateUserGoals,
  updateFriends,
  updateInvitesSent,
  selectNewlyCreated,
} from './src/redux/slices/authSlice';

import {requestNotificationsPermission} from './src/notifications/reminders';

// Onboarding pages
import Onboarding from './src/pages/SignedOut/Onboarding';
import OnboardingRegister from './src/pages/SignedOut/OnboardingRegister';
import SignIn from './src/pages/SignedOut/SignIn';

// Main pages
import Home from './src/pages/Home';
import Social from './src/pages/Social';
import Track from './src/pages/Track';
import Analytics from './src/pages/Goals/GoalsPage';
import Settings from './src/pages/Settings';

// Styling
import theme from './src/theme';
import {styles} from './src/styles';
import {useGetCurrentProfileQuery} from './src/redux/supabaseApi';

// TODO: temp fix
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  '@supabase/gotrue-js: Stack guards not supported in this environment.',
]);

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

type VariableIconProps = {
  focused: boolean;
  iconName: string;
  color?: number | ColorValue | undefined;
};
const VariableIcon = ({focused, iconName, color}: VariableIconProps) => (
  <View style={localStyles({color}).tabIcon}>
    <Icon
      name={focused ? iconName : `${iconName}-outline`}
      color={color}
      size={28}
    />
  </View>
);

function MainTabs() {
  const insets = useSafeAreaInsets();
  // const isNewUser = useSelector(selectNewlyCreated);

  // Only want to get the message token and check for permissions when we're logged in
  useEffect(() => {
    requestNotificationsPermission();
  }, []);

  return (
    <View style={styles.expand}>
      <FastImage source={backgroundImage} style={styles.absoluteFull} />
      <View style={styles.absoluteFull}>
        <Tab.Navigator
          tabBarPosition="bottom"
          initialLayout={{
            width: Dimensions.get('window').width,
          }}
          initialRouteName={'Track'}
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
          }}>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: ({color}) => (
                <Text
                  variant="labelSmall"
                  style={localStyles({color}).tabLabel}>
                  Home
                </Text>
              ),
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon iconName="home" focused={focused} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Social"
            component={Social}
            options={{
              tabBarLabel: ({color}) => (
                <Text
                  variant="labelSmall"
                  style={localStyles({color}).tabLabel}>
                  Friends
                </Text>
              ),
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="people-circle"
                  focused={focused}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Track"
            component={Track}
            options={{
              tabBarLabel: ({color}) => (
                <Text
                  variant="labelSmall"
                  style={localStyles({color}).tabLabel}>
                  Track goal
                </Text>
              ),
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="camera"
                  focused={focused}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Analytics"
            component={Analytics}
            options={{
              tabBarLabel: ({color}) => (
                <Text
                  variant="labelSmall"
                  style={localStyles({color}).tabLabel}>
                  Goals
                </Text>
              ),
              tabBarLabelStyle: {fontSize: 12},
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="stats-chart"
                  focused={focused}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="You"
            component={Settings}
            options={{
              tabBarLabel: ({color}) => (
                <Text
                  variant="labelSmall"
                  style={localStyles({color}).tabLabel}>
                  You
                </Text>
              ),
              tabBarLabelStyle: {fontSize: 12},
              tabBarShowLabel: true,
              tabBarIcon: ({focused, color}) => (
                <VariableIcon
                  iconName="person"
                  focused={focused}
                  color={color}
                />
              ),
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

      dispatch(updateUid(newSession?.user.id));
    });

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
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
};
const localStyles = (props: LocalStylesGeneratorType) =>
  StyleSheet.create({
    tabLabel: {
      color: props.color,
      textTransform: 'none',
      marginBottom: -10,
    },
    tabIcon: {
      alignItems: 'center',
      margin: -2, // This is for centering the icon correctly
    },
  });
