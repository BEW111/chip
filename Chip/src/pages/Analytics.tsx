/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  IconButton,
  Surface,
  Text,
  Headline,
  AnimatedFAB,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {useSelector} from 'react-redux';
import {selectUid} from '../redux/authSlice';

import Settings from '../components/Settings';

import backgroundImage from '../../assets/background.png';
import chipsIcon from '../../assets/chips-icon.png';

const Tab = createMaterialTopTabNavigator(); // for stats view
const SettingsDrawer = createDrawerNavigator(); // for settings

interface ChipObject {
  key: string;
  verb: string;
  timeSubmitted: FirebaseFirestoreTypes.Timestamp;
  photo: string;
}

function Sidebar() {
  return (
    <ScrollView
      style={{
        flex: 1,
      }}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <Surface
          style={{
            backgroundColor: 'rgb(220, 200, 220)',
            height: 80,
            width: 80,
            margin: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5,
            borderRadius: 20,
          }}>
          <IconButton icon="plus" color="purple" size={36} />
        </Surface>
        <TempGoal />
        <TempGoal />
        <TempGoal />
        <TempGoal />
        <TempGoal />
        <TempGoal />
      </View>
    </ScrollView>
  );
}

function TempGoal() {
  return (
    <Surface
      style={{
        backgroundColor: 'rgb(200, 220, 220)',
        height: 80,
        width: 80,
        margin: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 20,
      }}>
      <Text>Goal</Text>
    </Surface>
  );
}

function ChipDisplay(props) {
  const uid = useSelector(selectUid);
  const path = `user/${uid}/chip-photo/${props.photo}`;
  const [downloadURL, setDownloadURL] = useState('');
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    async function grabURL() {
      const newURL = await storage().ref(path).getDownloadURL();
      setDownloadURL(newURL);
    }
    grabURL();
  }, [path]);

  const toggleSelect = () => {
    setSelected(!selected);
  };

  return (
    <TouchableWithoutFeedback onPress={toggleSelect}>
      <View
        style={{
          height: 100,
          width: '32.64%',
          margin: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {downloadURL ? (
          <FastImage
            source={{uri: downloadURL}}
            style={{
              height: '100%',
              width: '100%',
              borderWidth: selected ? 3 : 0,
              borderColor: 'pink',
              overflow: 'hidden',
            }}
          />
        ) : (
          <></>
        )}
        <View style={{position: 'absolute', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>{props.date}</Text>
          <Text style={{color: 'white'}}>{props.time}</Text>
          <Text style={{color: 'white'}}>{props.verb}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function Stats1() {
  return (
    <View style={{flex: 1, backgroundColor: 'pink'}}>
      <Text> stats1 </Text>
    </View>
  );
}

function Stats2() {
  return (
    <View style={{flex: 1, backgroundColor: 'rgb(200, 200, 255)'}}>
      <Text> stats2 </Text>
    </View>
  );
}

function StatsView() {
  return (
    <View style={{width: '100%', height: '100%'}}>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle="dark-content"
      />
      <Tab.Navigator tabBar={() => null}>
        <Tab.Screen name="Stats1" component={Stats1} />
        <Tab.Screen name="Stats2" component={Stats2} />
      </Tab.Navigator>
    </View>
  );
}

function Header({navigation}) {
  return (
    <View style={{height: 50, justifyContent: 'center', marginBottom: 5}}>
      <Image
        source={chipsIcon}
        style={{
          position: 'absolute',
          height: 50,
          width: 50,
          left: 12,
        }}
      />
      <IconButton
        icon="cog"
        size={36}
        style={{
          position: 'absolute',
          right: 0,
        }}
        onPress={() => {
          navigation.toggleDrawer();
        }}
      />
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
  const insets = useSafeAreaInsets();
  const uid = useSelector(selectUid);

  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [chips, setChips] = useState([]);

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
    <View style={{flex: 1, backgroundColor: 'white'}}>
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
          height: '100%',
          paddingTop: insets.top,
        }}>
        <Header navigation={navigation} />
        <Divider style={{height: 2}} />
        <View
          style={{
            flex: 1,

            display: 'flex',
            flexDirection: 'row',
          }}>
          {/* Sidebar */}
          <Sidebar />
          {/* Main view */}
          <View style={{flex: 3, display: 'flex'}}>
            <View
              style={{
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Headline variant="displayMedium">Habit name goes here</Headline>
            </View>
            <View>
              <Surface
                style={{
                  height: 200,
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <StatsView />
              </Surface>
            </View>
            <ScrollView
              style={{
                flex: 1,
              }}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                }}>
                {chips.map((chip: ChipObject) => {
                  const date = chip.timeSubmitted.toDate().toLocaleDateString();
                  const time = chip.timeSubmitted.toDate().toLocaleTimeString();
                  return (
                    <ChipDisplay
                      key={chip.key}
                      verb={chip.verb}
                      photo={chip.photo}
                      date={date}
                      time={time}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <AnimatedFAB
        style={styles.fab}
        icon="share"
        onPress={() => console.log('Share button pressed')}
        label={'Share'}
        extended={false}
      />
    </View>
  );
}

export default function Analytics() {
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
          swipeEnabled: false,
        }}
      />
    </SettingsDrawer.Navigator>
  );
}
