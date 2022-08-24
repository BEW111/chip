import React, {useEffect} from 'react';

import {Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

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

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ff0000',
    secondary: '#00ff00',
    tertiary: '#00ffff',
  },
};

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      initialLayout={{
        width: Dimensions.get('window').width,
      }}
      initialRouteName="Home"
      style={{
        backgroundColor: 'white',
        paddingBottom: insets.bottom,
      }}>
      <Tab.Screen name="Social" component={Social} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Analytics" component={Analytics} />
    </Tab.Navigator>
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
  )
}

export default function App() {
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider>
          <Main />
        </PaperProvider>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
