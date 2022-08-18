import React from 'react';

import {Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Onboarding from './src/pages/Onboarding';
import OnboardingDone from './src/pages/OnboardingDone';
import Home from './src/pages/Home';
import Analytics from './src/pages/Analytics';
import Social from './src/pages/Social';

import store from './src/redux/store';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

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

export default function App() {
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="OnboardingDone" component={OnboardingDone} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
