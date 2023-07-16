import React, {useEffect} from 'react';

import {Dimensions, View, LogBox, ColorValue, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider as PaperProvider, Text} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/Ionicons';

import auth from '@react-native-firebase/auth';

import {store} from './src/redux/store';
import {useSelector, useDispatch} from 'react-redux';

import Onboarding from './src/pages/Launch/Onboarding';
import OnboardingRegister from './src/pages/Launch/OnboardingRegister';
import SignIn from './src/pages/Launch/SignIn';

// Main pages
import Home from './src/pages/Home';
import Social from './src/pages/Social';
import Track from './src/pages/Track';
import Analytics from './src/pages/Goals/Analytics';
import Settings from './src/pages/Settings';

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

import theme from './src/theme';
import {styles} from './src/styles';

import backgroundImage from './assets/background.png';

import {
  dispatchRefreshUserGoals,
  checkAllStreaksReset,
  getGoals,
} from './src/firebase/goals';
import {dispatchRefreshInvitesAndFriends} from './src/firebase/friends';
import {requestNotificationsPermission} from './src/notifications/reminders';

// TODO: temp fix
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
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
  const isNewUser = useSelector(selectNewlyCreated);

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
          initialRouteName={isNewUser ? 'Analytics' : 'Track'}
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
                  style={{
                    color,
                    textTransform: 'none',
                    marginBottom: -10,
                  }}>
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
                  style={{
                    color,
                    textTransform: 'none',
                    marginBottom: -10,
                  }}>
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
                  style={{
                    color,
                    textTransform: 'none',
                    marginBottom: -10,
                  }}>
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
                  style={{
                    color,
                    textTransform: 'none',
                    marginBottom: -10,
                  }}>
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
                  style={{
                    color,
                    textTransform: 'none',
                    marginBottom: -10,
                  }}>
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

function Main() {
  const dispatch = useDispatch();
  const initializing = useSelector(selectInitializing);
  const user = useSelector(selectUser);

  // Handle user state changes
  var authFlag = true; // hacky, but prevents contents from being called twice inside
  async function onAuthStateChanged(newUser) {
    // TODO: put into separate function
    if (newUser && authFlag) {
      authFlag = false;

      dispatch(updateUser(newUser.toJSON()));
      dispatch(updateUid(newUser.uid));

      const goals = await getGoals(newUser.uid); // retrive user data from firestore

      if (goals.length) {
        dispatchRefreshUserGoals(newUser.uid, dispatch, goals);
        checkAllStreaksReset(newUser.uid, goals);
      }

      dispatchRefreshInvitesAndFriends(newUser.uid, dispatch);
    } else {
      if (!newUser) {
        console.log('[onAuthStateChanged] Signed out');
        dispatch(updateUser(null));
        dispatch(updateUid(null));
        dispatch(updateUserGoals([]));
        dispatch(updateInvitesSent([]));
        dispatch(updateFriends([]));
        authFlag = true;
      }
    }

    if (initializing) {
      dispatch(updateInitializing(false));
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (!user) {
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

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

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

type LocalStylesGeneratorType = {
  color: ColorValue | number | undefined;
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
