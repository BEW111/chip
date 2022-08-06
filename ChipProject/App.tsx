import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Onboarding from './src/pages/Onboarding';
import OnboardingDone from './src/pages/OnboardingDone';
import Home from './src/pages/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="OnboardingDone" component={OnboardingDone} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
