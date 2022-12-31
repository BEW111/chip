/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {ActivityIndicator, Divider, Text, IconButton} from 'react-native-paper';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import firestore from '@react-native-firebase/firestore';

import {useSelector} from 'react-redux';
import {selectUid, selectUserGoals} from '../../redux/authSlice';
import {Goal} from '../../types';

import GoalWidget from '../../components/GoalWidgets/GoalWidget';
import AddGoalWidget from '../../components/GoalWidgets/AddGoalWidget';
import ChartWidget from '../../components/GoalWidgets/ChartWidget';

import Settings from '../../components/Settings';
import Header from '../../components/Analytics/Header';
import GoalPage from './GoalPage';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import BackgroundWrapper from '../../components/BackgroundWrapper';

import {styles} from '../../styles';

const SettingsDrawer = createDrawerNavigator(); // for settings
const Stack = createNativeStackNavigator();

function MainPage({navigation}) {
  const uid = useSelector(selectUid);
  const userGoals = useSelector(selectUserGoals);

  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [chips, setChips] = useState([]);
  // const selectedGoal = useSelector(selectSelectedGoal);

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(uid)
      .collection('chips')
      .onSnapshot(querySnapshot => {
        if (querySnapshot) {
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
        }

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
      <FocusAwareStatusBar animated={true} barStyle="dark-content" />
      <BackgroundWrapper>
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
          <ScrollView contentContainerStyle={{padding: 16}} style={{flex: 1}}>
            <ChartWidget
              chartType="day-occurrence"
              title="habit occurrences"
              chips={chips}
            />
            <Divider style={styles.dividerSmall} />
            {userGoals.map((goal: Goal) => (
              <View key={goal.id}>
                <GoalWidget goal={goal} navigation={navigation} />
                <Divider style={styles.dividerSmall} />
              </View>
            ))}
            <AddGoalWidget />
          </ScrollView>
        </View>
      </BackgroundWrapper>
    </>
  );
}

function AnalyticsLandingPage() {
  return (
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
          drawerStyle: {
            width: '100%',
            height: '100%',
          },
        }}
      />
    </SettingsDrawer.Navigator>
  );
}

export default function AnalyticsPage() {
  return (
    <Stack.Navigator initialRouteName="AnalyticsLandingPage">
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
