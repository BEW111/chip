/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  // Image,
  // Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';

// import Icon from 'react-native-vector-icons/Ionicons';

// import {ActivityIndicator, Divider,} from 'react-native-paper';
// import {createDrawerNavigator} from '@react-navigation/drawer';

// import firestore, {
//   FirebaseFirestoreTypes,
// } from '@react-native-firebase/firestore';

// import {useSelector} from 'react-redux';
// import {selectUid, selectUserGoals} from '../redux/authSlice';
// import {selectSelectedGoal} from '../redux/analyticsSlice';

// import Settings from '../components/Settings';

// import { addGoal } from '../utils/postUtils';

import GoalSurface from '../components/Analytics/GoalSurface';

import {ActivityIndicator, Divider, Text, IconButton} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {useSelector} from 'react-redux';
import {selectUid, selectUserGoals} from '../redux/authSlice';
import {selectSelectedGoal, updateSelectedGoal} from '../redux/analyticsSlice';

import Settings from '../components/Settings';

// import ChipDisplayMini from '../components/Analytics/ChipDisplayMini';
// import ChipDisplayLarge from '../components/Analytics/ChipDisplayLarge';
import DayOccurrenceChart from '../components/Analytics/DayOccurrenceChart';
import Header from '../components/Analytics/Header';

import GoalPage from './GoalPage';

import backgroundImage from '../../assets/background.png';

import {addGoal} from '../utils/postUtils';

const SettingsDrawer = createDrawerNavigator(); // for settings
const Stack = createNativeStackNavigator();

export interface ChipObject {
  key: string;
  goal: string;
  timeSubmitted: FirebaseFirestoreTypes.Timestamp;
  photo: string;
  description: string;
}

function StatsView({filteredChips}) {
  return (
    <View style={{width: '100%', height: '100%'}}>
      <DayOccurrenceChart chips={filteredChips} />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

function MainPage({navigation}) {
  const uid = useSelector(selectUid);
  const userGoals = useSelector(selectUserGoals);

  const allGoals = [
    ...new Set([...userGoals, ...['Exercise', 'Eat healthy', 'Study']]),
  ];

  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [chips, setChips] = useState([]);
  const selectedGoal = useSelector(selectSelectedGoal);

  const [fabOpen, setFabOpen] = useState(false);
  const onFabStateChange = ({open}) => setFabOpen(open);

  const chipViewType: 'tiled' | 'swipe' = 'tiled';

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
              <StatsView
                filteredChips={chips.filter(
                  (chip: ChipObject) => chip.goal === selectedGoal,
                )}
              />
            </View>
            <Divider style={{marginVertical: 7, height: 0}} />
            <GoalSurface
              title="Cook more"
              subtitle="5 day streak"
              subtitleType="streak"
              navigation={navigation}
            />
            <Divider style={{marginVertical: 7, height: 0}} />
            <GoalSurface
              title="Read every day"
              subtitle="12 mins left today"
              subtitleType="todo"
              navigation={navigation}
            />
            <Divider style={{marginVertical: 7, height: 0}} />
            <GoalSurface
              title="Learn Korean"
              subtitle="Daily target completed"
              subtitleType="completed"
              navigation={navigation}
            />
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
