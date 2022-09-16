import React, {useEffect} from 'react';

import {Dimensions, View, Image} from 'react-native';
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
import firestore from '@react-native-firebase/firestore';

import store from './src/redux/store';
import {useSelector, useDispatch} from 'react-redux';

import Onboarding from './src/pages/Onboarding';
import OnboardingRegister from './src/pages/OnboardingRegister';
import SignIn from './src/pages/SignIn';
import Home from './src/pages/Home';
import Analytics from './src/pages/Analytics';
import Social from './src/pages/Social';
import {
  selectInitializing,
  selectNewlyCreated,
  selectUser,
  updateInitializing,
  updateNewlyCreated,
  updateUid,
  updateUser,
} from './src/redux/authSlice';

import theme from './src/theme';

import backgroundImage from './assets/background.png';

import GoalGalaxyView from './src/components/GoalGalaxy/GoalGalaxyView';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1}}>
      <Image
        source={backgroundImage}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      />
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}>
        <Tab.Navigator
          tabBarPosition="bottom"
          initialLayout={{
            width: Dimensions.get('window').width,
          }}
          initialRouteName="Home"
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
  const newlyCreated = useSelector(selectNewlyCreated);

  // Handle user state changes
  function onAuthStateChanged(updatedUser) {
    console.log('auth state change');

    if (updatedUser) {
      dispatch(updateUser(updatedUser.toJSON()));
      dispatch(updateUid(updatedUser.uid));

      // Handle if this is the first time the user has logged in
      if (newlyCreated) {
        dispatch(updateNewlyCreated(false));

        const currentdt = new Date();

        firestore()
          .collection('users')
          .doc(updatedUser.uid)
          .set({
            timeCreated: currentdt,
          })
          .then(() => {
            console.log('User added to firestore!');
          })
          .catch(e => {
            console.log(e);
          });
      }
    } else {
      dispatch(updateUser(null));
      dispatch(updateUid(null));
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
          }}>
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
