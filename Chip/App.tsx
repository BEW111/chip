import React, {useEffect} from 'react';

import {Dimensions, View, LogBox} from 'react-native';
import FastImage from 'react-native-fast-image';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import auth from '@react-native-firebase/auth';

import {store} from './src/redux/store';
import {useSelector, useDispatch} from 'react-redux';

import Onboarding from './src/pages/Launch/Onboarding';
import OnboardingRegister from './src/pages/Launch/OnboardingRegister';
import SignIn from './src/pages/Launch/SignIn';
import Home from './src/pages/Home';
import Analytics from './src/pages/Goals/Analytics';
import Social from './src/pages/Social';
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
} from './src/redux/authSlice';

import theme from './src/theme';
import {styles} from './src/styles';

import backgroundImage from './assets/background.png';

import {
  dispatchRefreshUserGoals,
  checkAllStreaksReset,
  getGoals,
} from './src/firebase/goals';
import {dispatchRefreshInvitesAndFriends} from './src/firebase/friends';

// temp fix
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();

  const isNewUser = useSelector(selectNewlyCreated);

  return (
    <View style={styles.expand}>
      <FastImage source={backgroundImage} style={styles.absoluteFull} />
      <View style={styles.absoluteFull}>
        <Tab.Navigator
          tabBarPosition="bottom"
          initialLayout={{
            width: Dimensions.get('window').width,
          }}
          initialRouteName={isNewUser ? 'Analytics' : 'Home'}
          style={{
            paddingBottom: insets.bottom,
          }}
          screenOptions={{
            tabBarActiveTintColor: '#e91e63',
            tabBarLabelStyle: {fontSize: 24},
            tabBarStyle: {backgroundColor: 'rgba(0, 0, 0, 0)'},
            tabBarShowLabel: false,
            tabBarIndicatorStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
            },
          }}>
          <Tab.Screen
            name="Social"
            component={Social}
            options={{
              tabBarIcon: ({focused, color}) => (
                <View style={{alignItems: 'center', margin: -3}}>
                  <Icon
                    name={focused ? 'people-circle' : 'people-circle-outline'}
                    color={color}
                    size={28}
                  />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({focused, color}) => (
                <View style={{alignItems: 'center', margin: -3}}>
                  <Icon
                    name={focused ? 'camera' : 'camera-outline'}
                    color={color}
                    size={28}
                  />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Analytics"
            component={Analytics}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({focused, color}) => (
                <View style={{alignItems: 'center', margin: -3}}>
                  <Icon
                    name={focused ? 'stats-chart' : 'stats-chart-outline'}
                    color={color}
                    size={28}
                  />
                </View>
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
        <PaperProvider
          theme={theme}
          settings={{
            icon: props => <Icon {...props} />,
          }}>
          <Main />
        </PaperProvider>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
