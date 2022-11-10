import React, {useState, useEffect} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button, IconButton, Modal, Portal, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

import {FAB, ActivityIndicator, Divider} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Ionicons';

import {createDrawerNavigator} from '@react-navigation/drawer';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {useSelector} from 'react-redux';
import {selectUid, selectUserGoals} from '../redux/authSlice';
import {selectSelectedGoal} from '../redux/analyticsSlice';

import Settings from '../components/Settings';

import {
  scheduleNotification,
  onDisplayNotification,
  onCreateTriggerNotification,
  requestNotificationsPermission,
} from '../utils/notifcations';

import DayOccurrenceChart from '../components/Analytics/DayOccurrenceChart';
import Header from '../components/Analytics/Header';

import backgroundImage from '../../assets/background.png';
import ImageCarouselWidget from '../components/Analytics/ImageCarouselWidget';
// import chipsIcon from '../../assets/chips-icon.png';

import {ChipObject} from './Analytics';
import TextWidget from '../components/Analytics/TextWidget';

import {styles, modalStyles} from '../styles';

function StatsView({filteredChips}) {
  return (
    <View style={styles.full}>
      <DayOccurrenceChart chips={filteredChips} />
    </View>
  );
}

function ReminderFAB() {
  const [fabOpen, setFabOpen] = useState(false);
  const onFabStateChange = ({open}) => setFabOpen(open);

  const {colors} = useTheme();

  return (
    <View style={styles.absoluteFull} pointerEvents={'box-none'}>
      <FAB.Group
        visible={true}
        open={fabOpen}
        icon={fabOpen ? 'close' : 'menu'}
        fabStyle={{backgroundColor: colors.primary}}
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
        onStateChange={o => {
          onFabStateChange(o);
        }}
        onPress={() => {}}
      />
    </View>
  );
}

export default function GoalPage({navigation, route}) {
  // const [visible, setVisible] = React.useState(false);

  const {goal} = route.params;

  const uid = useSelector(selectUid);

  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [chips, setChips] = useState([]);

  const [modalVisible, setModalVisible] = React.useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  // const chipViewType: 'tiled' | 'swipe' = 'tiled';

  // get all chips
  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(uid)
      .collection('chips')
      .onSnapshot(querySnapshot => {
        let newChips: ChipObject[] = [];
        querySnapshot.forEach(documentSnapshot => {
          return newChips.push({
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
  }, [uid]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={modalStyles.container}>
          {/* <Text style={modalStyles.header}>Add a new goal</Text>
          <TextInput
            style={modalStyles.textInput}
            label="Name of goal"
            value={goalInput}
            onChangeText={text => setGoalInput(text)}
          /> */}
          <Button
            mode="contained"
            onPress={() => {
              // addGoal(uid, goalInput);
              // setGoalInput('');
              // hideModal();
            }}>
            Delete goal
          </Button>
        </Modal>
      </Portal>
      <View style={styles.expand}>
        <FastImage source={backgroundImage} style={styles.absoluteFull} />
        <View style={styles.full}>
          <Header navigation={navigation}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{goal}</Text>
            <View style={{position: 'absolute', display: 'flex', left: 4}}>
              <IconButton
                icon="chevron-back-outline"
                size={28}
                onPress={() => {
                  navigation.navigate('AnalyticsLandingPage');
                }}
              />
            </View>
            <View style={{position: 'absolute', display: 'flex', right: 4}}>
              <IconButton
                icon="pencil"
                size={32}
                onPress={() => {
                  showModal();
                }}
              />
            </View>
          </Header>
          <ScrollView style={{flex: 1, padding: 20}}>
            <TextWidget
              subtitle={'Try cooking a new dish this weekend'}
              subtitleType="hint"
            />
            <Divider style={{marginVertical: 7, height: 0}} />
            <View
              style={{
                height: 224,
                alignItems: 'center',
                width: '100%',
              }}>
              <StatsView
                filteredChips={chips.filter(
                  (chip: ChipObject) => chip.goal === goal,
                )}
              />
            </View>
            <Divider style={{marginVertical: 7, height: 0}} />
            <ImageCarouselWidget
              navigation={navigation}
              chips={chips.filter((chip: ChipObject) => chip.goal === goal)}
            />
          </ScrollView>
        </View>
      </View>
      <ReminderFAB />
    </>
  );
}
