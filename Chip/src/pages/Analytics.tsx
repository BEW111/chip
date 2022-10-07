/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, StatusBar, Image, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  IconButton,
  FAB,
  Portal,
  ActivityIndicator,
  Divider,
  Button,
  Text,
  Menu,
  Modal,
  TextInput,
} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {useSelector, useDispatch} from 'react-redux';
import {selectUid, selectUserGoals} from '../redux/authSlice';
import {selectSelectedGoal, updateSelectedGoal} from '../redux/analyticsSlice';

import Settings from '../components/Settings';

import ChipDisplayMini from '../components/Analytics/ChipDisplayMini';
import ChipDisplayLarge from '../components/Analytics/ChipDisplayLarge';
import DayOccurrenceChart from '../components/Analytics/DayOccurrenceChart';

import backgroundImage from '../../assets/background.png';
import chipsIcon from '../../assets/chips-icon.png';

import { addGoal } from '../utils/postUtils';

const SettingsDrawer = createDrawerNavigator(); // for settings

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
      <DayOccurrenceChart chips={filteredChips}/>
    </View>
  );
}

function Header({navigation, goals}) {
  const [goal, setGoal] = useState(goals[0]);
  const uid = useSelector(selectUid);

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const modalStyle = {
    backgroundColor: 'white', 
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 5,
  };

  const [newGoalText, setNewGoalText] = useState('');

  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  dispatch(updateSelectedGoal(goal));

  const menuAnchor = <IconButton
    icon={({ size, color }) => (
      <Image
        source={chipsIcon}
        style={{ width: size, height: size }}
      />
    )}
    size={42}
    style={{
      marginVertical: -5,
    }}
    onPress={openMenu}
  />
  
  return (
    <View style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', paddingTop: insets.top, paddingBottom: 5, display: 'flex', flexDirection: 'row'}}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={menuAnchor}
        style={{
          marginTop: 60,
        }}>
        {goals.map(g => (
          <Menu.Item
            icon="arrow-forward-circle" 
            onPress={() => {setGoal(g); dispatch(updateSelectedGoal(g)); closeMenu()}} 
            title={g} 
            key={g}
            contentStyle={{
              marginLeft: -10
            }}
          />
        ))}
        <Menu.Item 
          icon="add-circle"
          onPress={() => {setNewGoalText(''); setModalVisible(true); closeMenu()}}
          title="Create new goal"
          contentStyle={{
            marginLeft: -10
          }}
        />
      </Menu>
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>
        {goal}
      </Text>
      <View style={{display: 'flex', marginLeft: 'auto'}}>
        <IconButton
          icon="cog"
          size={42}
          style={{
            marginVertical: -5
          }}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        />
      </View>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={modalStyle}>
          <Text style={{color: 'black', fontSize: 24, marginBottom: 10, textAlign: 'auto', fontWeight: 'bold'}}>Ready to set another goal?</Text>
          <TextInput
            mode="outlined"
            placeholder="Something new"
            onChangeText={newText => setNewGoalText(newText)}
            defaultValue={newGoalText}
            style={{color: 'black', fontSize: 18, marginBottom: 20, textAlign: 'auto'}}
            underlineColor="gray"
            activeUnderlineColor="white"
          />
          <Button mode="contained" labelStyle={{fontSize: 18}} onPress={() => {
            addGoal(newGoalText, uid); 
            hideModal(); 
          }}>Add goal</Button>
        </Modal>
      </Portal>
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

  const allGoals = [...new Set([...userGoals, ...['Exercise', 'Eat healthy', 'Study']])];

  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [chips, setChips] = useState([]);
  const selectedGoal = useSelector(selectSelectedGoal);

  console.log(selectedGoal);

  const [fabOpen, setFabOpen] = useState(false);
  const onFabStateChange = ({ open }) => setFabOpen(open);

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
          <Header navigation={navigation} goals={allGoals} />
          <Divider style={{height: 2, marginBottom: 10}} />
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
                  <StatsView filteredChips={chips.filter((chip: ChipObject) => (chip.goal === selectedGoal))}/>
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
      </View>
      <View style={{position: 'absolute', height: '100%', width: '100%'}} pointerEvents={"box-none"}>
        <FAB.Group
          visible={true}
          open={fabOpen}
          icon={fabOpen ? 'close' : 'menu'}
          actions={[
            {
              icon: 'alarm',
              label: 'Remind (to be implemented)',
              onPress: () => console.log('Pressed notifications'),
            },
            {
              icon: 'share',
              label: 'Share (to be implemented)',
              onPress: () => console.log('Pressed star'),
            },
            {
              icon: 'trash',
              label: 'Delete (to be implemented)',
              onPress: () => console.log('Pressed email'),
            },
          ]}
          onStateChange={(o) => {
            onFabStateChange(o);
          }}
          onPress={() => {
          }}
        />
      </View>
    </>
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
