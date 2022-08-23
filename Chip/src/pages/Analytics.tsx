/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  IconButton,
  Surface,
  Text,
  Headline,
  AnimatedFAB,
  ActivityIndicator,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {useSelector} from 'react-redux';
import {selectUid} from '../redux/authSlice';

const Tab = createMaterialTopTabNavigator();

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
        backgroundColor: 'rgb(200, 200, 200)',
        flex: 1,
      }}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
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
      <Surface
        style={{
          backgroundColor: selected ? 'yellow' : 'white',
          height: 100,
          width: '32%',
          margin: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {downloadURL ? (
          <Image
            source={{uri: downloadURL}}
            style={{
              height: '90%',
              width: '90%',
            }}
          />
        ) : (
          <></>
        )}
        <Text style={{color: 'white', position: 'absolute'}}>
          {props.timeSubmitted}, {props.verb}
        </Text>
      </Surface>
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

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default function Analytics() {
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
      <View
        style={{
          height: '100%',
          paddingTop: insets.top,
        }}>
        <View
          style={{
            flex: 1,

            display: 'flex',
            flexDirection: 'row',
          }}>
          {/* Sidebar */}
          <Sidebar />
          {/* Main view */}
          <View style={{backgroundColor: 'white', flex: 3, display: 'flex'}}>
            <View
              style={{
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Headline variant="displayMedium">Habit name goes here</Headline>
            </View>
            <View style={{backgroundColor: 'white'}}>
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
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {chips.map((chip: ChipObject) => {
                  const date = chip.timeSubmitted.toDate().toLocaleString();
                  return (
                    <ChipDisplay
                      key={chip.key}
                      verb={chip.verb}
                      photo={chip.photo}
                      timeSubmitted={date}
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
