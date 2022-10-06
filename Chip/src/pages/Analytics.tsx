/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, StatusBar, Image, Dimensions} from 'react-native';

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

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  AbstractChart,
} from "react-native-chart-kit";

// import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';

import {useSelector} from 'react-redux';
import {selectUid, selectUserGoals} from '../redux/authSlice';

import Settings from '../components/Settings';
import Dropdown from '../components/Analytics/Dropdown';

import ChipDisplayMini from '../components/Analytics/ChipDisplayMini';
import ChipDisplayLarge from '../components/Analytics/ChipDisplayLarge';

import backgroundImage from '../../assets/background.png';
import chipsIcon from '../../assets/chips-icon.png';

const SettingsDrawer = createDrawerNavigator(); // for settings

interface ChipObject {
  key: string;
  goal: string;
  timeSubmitted: FirebaseFirestoreTypes.Timestamp;
  photo: string;
  description: string;
}

function TestChart({width, height}) {
  return (
    <LineChart
      data={{
        labels: [...Array(7).keys()].map(k => {
          let d = new Date();
          d.setDate(d.getDate() - (6 - k));
          var dd = String(d.getDate()).padStart(2, '0');
          var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
          return `${mm}/${dd}`;
        }),
        datasets: [
          {
            data: [
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100
            ]
          }
        ]
      }}
      width={width} // from react-native
      height={height}
      yAxisLabel="$"
      yAxisSuffix="k"
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#29434E",
        backgroundGradientFrom: "#546E7A",
        backgroundGradientTo: "#A7C5D2",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#29434E"
        }
      }}
      bezier
      style={{
        borderRadius: 0,
      }}
    />
  );
}

function Stats1() {
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  return (
    <View style={{flex: 1}} onLayout={(event) => {
      var {width, height} = event.nativeEvent.layout;
      setChartWidth(width);
      setChartHeight(height);
    }}>
      <TestChart width={chartWidth} height={chartHeight}/>
    </View>
  );
}

function Stats2() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgb(200, 200, 255)',
        borderRadius: 10,
      }}>
      <Text> stats2 </Text>
    </View>
  );
}

function StatsView() {
  return (
    <View style={{width: '100%', height: '100%'}}>
      {/* <Swiper key={2} index={0}>
        <Stats1 />
        <Stats2 />
      </Swiper> */}
      <Stats1 />
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
  const userGoals = useSelector(selectUserGoals);

  const allGoals = [...new Set([...userGoals, ...['Exercise', 'Eat healthy', 'Study']])];
  const goalsList = allGoals.map(goal => {
    return {label: goal, value: goal};
  })

  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [chips, setChips] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(allGoals[0]);

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
                flex: 0.7,
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <View
                style={{
                  width: '98%',
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
                  width: '98%',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '100%',

                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                  }}>
                  {chips.filter((chip: ChipObject) => (chip.goal === selectedGoal)).map((chip: ChipObject) => {
                    const date = chip.timeSubmitted
                      .toDate()
                      .toLocaleDateString('en-US', { dateStyle: 'short' });
                    const time = chip.timeSubmitted
                      .toDate()
                      .toLocaleTimeString('en-US', { timeStyle: 'short' });
                    return (
                      <View style={{width: '33.3%', aspectRatio: 1}} key={chip.key}>
                        <ChipDisplayMini
                          key={chip.key}
                          verb={chip.description}
                          photo={chip.photo}
                          date={date}
                          time={time}
                        />
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <Swiper
                key={chips.length}
                loop={false}
                dot={
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,.2)',
                      width: 12,
                      height: 6,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }
                activeDot={
                  <View
                    style={{
                      backgroundColor: '#B4004E',
                      width: 12,
                      height: 6,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }>
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
                          goal={chip.goal}
                          photo={chip.photo}
                          description={chip.description}
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
      <AnimatedFAB
        style={styles.fab}
        icon="share"
        // onPress={() => console.log('Share button pressed')}
        label={'Share'}
        extended={false}
      />
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
