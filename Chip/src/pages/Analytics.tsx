/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, ScrollView, StatusBar} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ActivityIndicator, Divider, Text, IconButton} from 'react-native-paper';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import firestore from '@react-native-firebase/firestore';

import {useSelector} from 'react-redux';
import {selectUid, selectUserGoals} from '../redux/authSlice';
import {selectSelectedGoal} from '../redux/analyticsSlice';

import GoalSurface from '../components/GoalWidgets/GoalSurface';
import AddGoalSurface from '../components/GoalWidgets/AddGoalSurface';

import Settings from '../components/Settings';
import DayOccurrenceChart from '../components/GoalWidgets/DayOccurrenceChart';
import Header from '../components/Analytics/Header';
import GoalPage from './GoalPage';

import {ChipObject, Goal} from '../types';

import backgroundImage from '../../assets/background.png';

const SettingsDrawer = createDrawerNavigator(); // for settings
const Stack = createNativeStackNavigator();

function StatsView({filteredChips}) {
  return (
    <View style={{width: '100%', height: '100%'}}>
      <DayOccurrenceChart chips={filteredChips} />
    </View>
  );
}

function MainPage({navigation}) {
  const uid = useSelector(selectUid);
  const userGoals = useSelector(selectUserGoals);

  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [chips, setChips] = useState([]);
  const selectedGoal = useSelector(selectSelectedGoal);

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(uid)
      .collection('chips')
      .onSnapshot(querySnapshot => {
        let newChips = [];
        querySnapshot.forEach(documentSnapshot => {
          newChips.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        newChips = newChips.sort((a, b) =>
          a.timeSubmitted < b.timeSubmitted ? 1 : -1,
        );
        setChips(newChips);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <View style={{flex: 1}}>
        <FastImage
          source={backgroundImage}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
        />
        <View
          style={{
            height: '100%',
          }}>
          <Header navigation={navigation}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>Goals</Text>
            <View style={{position: 'absolute', display: 'flex', right: 4}}>
              <IconButton
                icon="person-circle-outline"
                size={36}
                style={{
                  marginVertical: -5,
                }}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </View>
          </Header>
          <ScrollView style={{flex: 1, padding: 20}}>
            <View
              style={{
                height: 224,
                alignItems: 'center',
                width: '100%',
              }}>
              <StatsView filteredChips={chips} />
            </View>
            <Divider style={{marginVertical: 7, height: 0}} />
            {userGoals.map((goal: Goal) => (
              <View key={goal.id}>
                <GoalSurface
                  goalId={goal.id}
                  goalName={goal.name}
                  subtitle="Flavor text here"
                  subtitleType="scheduled"
                  streak={goal.streak}
                  navigation={navigation}
                />
                <Divider style={{marginVertical: 7, height: 0}} />
              </View>
            ))}
            <AddGoalSurface />
          </ScrollView>
        </View>
      </View>
    </>
  );
}

function AnalyticsLandingPage() {
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle="dark-content"
      />
      <SettingsDrawer.Navigator
        initialRouteName="AnalyticsMain"
        drawerContent={props => <Settings {...props} />}>
        <SettingsDrawer.Screen
          name="AnalyticsMain"
          component={MainPage}
          options={{
            headerShown: false,
            drawerPosition: 'right',
            drawerType: 'front',
            swipeEnabled: false,
          }}
        />
      </SettingsDrawer.Navigator>
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AnalyticsLandingPage"
        component={AnalyticsLandingPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AnalyticsGoalPage"
        component={GoalPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
