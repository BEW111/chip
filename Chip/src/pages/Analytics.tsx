/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, StatusBar, Image} from 'react-native';

import {
  IconButton,
  Surface,
  Text,
  AnimatedFAB,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';

// import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';

import {useSelector} from 'react-redux';
import {selectUid} from '../redux/authSlice';

import Settings from '../components/Settings';
import Dropdown from '../components/Analytics/Dropdown';

import ChipDisplayMini from '../components/Analytics/ChipDisplayMini';
import ChipDisplayLarge from '../components/Analytics/ChipDisplayLarge';

import backgroundImage from '../../assets/background.png';
import chipsIcon from '../../assets/chips-icon.png';

const SettingsDrawer = createDrawerNavigator(); // for settings

interface ChipObject {
  key: string;
  verb: string;
  timeSubmitted: FirebaseFirestoreTypes.Timestamp;
  photo: string;
}

function Stats1() {
  return (
    <View style={{flex: 1, backgroundColor: 'pink', borderRadius: 10}}>
      <Text> stats1 </Text>
    </View>
  );
}

function Stats2() {
  return (
    <View style={{flex: 1, backgroundColor: 'rgb(200, 200, 255)', borderRadius: 10}}>
      <Text> stats2 </Text>
    </View>
  );
}

function StatsView() {
  return (
    <View style={{width: '100%', height: '100%'}}>
      <Swiper key={2} index={0}>
        <Stats1 />
        <Stats2 />
      </Swiper>
    </View>
  );
}

function Header({navigation}) {
  return (
    <View style={{height: 40, justifyContent: 'center', marginBottom: 5}}>
      <Image
        source={chipsIcon}
        style={{
          position: 'absolute',
          height: 40,
          width: 40,
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('workouts');

  const chipViewType: 'tiled' | 'swipe' = 'swipe';

  const goalsList = [
    {
      label: 'Workouts',
      value: 'workouts',
    },
    {
      label: 'Eating healthy',
      value: 'eating',
    },
    {
      label: 'Studying',
      value: 'studying',
    },
  ];

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
          {/* Main view */}
          <View style={{flex: 1, display: 'flex'}}>
            <View
              style={{
                paddingVertical: 7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Dropdown
                mode={'flat'}
                visible={showDropdown}
                showDropDown={() => setShowDropdown(true)}
                onDismiss={() => setShowDropdown(false)}
                value={selectedGoal}
                setValue={setSelectedGoal}
                list={goalsList}
              />
            </View>
            <View
              style={{
                flex: 0.5,

                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '95%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <StatsView />
              </View>
            </View>
            {chipViewType === 'tiled' ? (
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
                    const date = chip.timeSubmitted
                      .toDate()
                      .toLocaleDateString();
                    const time = chip.timeSubmitted
                      .toDate()
                      .toLocaleTimeString();
                    return (
                      <ChipDisplayMini
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
            ) : (
              <Swiper
                key={chips.length}
                loop={false}>
                {chips.map((chip: ChipObject) => {
                  const date = chip.timeSubmitted.toDate().toLocaleDateString();
                  const time = chip.timeSubmitted.toDate().toLocaleTimeString();
                  return (
                    <View
                      style={{
                        height: '100%',
                        width: '100%',
                      }}>
                      <View
                        style={{
                          height: '100%',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                        <ChipDisplayLarge
                          key={chip.key}
                          verb={chip.verb}
                          photo={chip.photo}
                          date={date}
                          time={time}
                        />
                      </View>
                    </View>
                  );
                })}
              </Swiper>
            )}
          </View>
        </View>
      </View>
      {chipViewType === 'tiled' && (
        <AnimatedFAB
          style={styles.fab}
          icon="share"
          onPress={() => console.log('Share button pressed')}
          label={'Share'}
          extended={false}
        />
      )}
    </View>
  );
}

export default function Analytics() {
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
