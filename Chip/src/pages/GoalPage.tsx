import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  TextInput,
  Text,
  useTheme,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

import {FAB, ActivityIndicator, Divider} from 'react-native-paper';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {useSelector, useDispatch} from 'react-redux';
import {selectUid, selectUserGoals} from '../redux/authSlice';

import DayOccurrenceChart from '../components/GoalWidgets/DayOccurrenceChart';
import Header from '../components/Analytics/Header';

import backgroundImage from '../../assets/background.png';
import ImageCarouselWidget from '../components/GoalWidgets/ImageCarouselWidget';
// import chipsIcon from '../../assets/chips-icon.png';

import {ChipObject} from './Analytics';
import TextWidget from '../components/GoalWidgets/TextWidget';
import RemindersModal from '../components/GoalDetail/ReminderModal';

import {editGoalName, deleteGoal} from '../firebase/goals';

import {styles, modalStyles} from '../styles';

function StatsView({filteredChips}) {
  return (
    <View style={styles.full}>
      <DayOccurrenceChart chips={filteredChips} />
    </View>
  );
}

function EditGoalModal({
  visible,
  setGoalName,
  hideModal,
  uid,
  goalId,
  routeGoalName,
}) {
  const [goalNameInput, setGoalNameInput] = useState(routeGoalName);

  const dispatch = useDispatch();

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={modalStyles.container}>
      <Text style={modalStyles.header}>Edit goal</Text>
      <TextInput
        style={modalStyles.textInput}
        label="Edit goal name"
        value={goalNameInput}
        onChangeText={text => setGoalNameInput(text)}
      />
      <Button
        mode="contained"
        onPress={() => {
          editGoalName(uid, goalId, goalNameInput, dispatch);
          setGoalName(goalNameInput);
          setGoalNameInput('');
          hideModal();
        }}>
        Change goal name
      </Button>
    </Modal>
  );
}

function DeleteGoalModal({visible, hideModal, uid, goalId, navigation}) {
  const dispatch = useDispatch();

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={modalStyles.container}>
      <Text style={modalStyles.header}>
        Are you sure you'd like to delete this goal?
      </Text>
      <Button
        mode="contained"
        onPress={() => {
          deleteGoal(uid, goalId, dispatch);
          navigation.navigate('AnalyticsLandingPage');
        }}>
        Delete
      </Button>
    </Modal>
  );
}

function ReminderFAB({showRemindersModal, showDeleteGoalModal}) {
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
            label: 'Reminders',
            onPress: () => {
              showRemindersModal();
            },
          },
          {
            icon: 'share',
            label: 'Share (to be implemented)',
            onPress: () => console.log('Pressed star'),
          },
          {
            icon: 'trash',
            label: 'Delete',
            onPress: () => {
              showDeleteGoalModal();
            },
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
  // Managing goals and user data
  const {goalId, routeGoalName} = route.params;
  const [goalName, setGoalName] = useState(routeGoalName);

  const uid = useSelector(selectUid);

  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [chips, setChips] = useState([]);

  // Modals
  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);
  const showEditGoalModal = () => setEditGoalModalVisible(true);
  const hideEditGoalModal = () => setEditGoalModalVisible(false);

  const [remindersModalVisible, setRemindersModalVisible] = useState(false);
  const showRemindersModal = () => setRemindersModalVisible(true);
  const hideRemindersModal = () => setRemindersModalVisible(false);

  const [deleteGoalModalVisible, setDeleteGoalModalVisible] = useState(false);
  const showDeleteGoalModal = () => setDeleteGoalModalVisible(true);
  const hideDeleteGoalModal = () => setDeleteGoalModalVisible(false);

  // Get all chips
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

  // Check if loading
  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Portal>
        <EditGoalModal
          visible={editGoalModalVisible}
          setGoalName={setGoalName}
          hideModal={hideEditGoalModal}
          uid={uid}
          goalId={goalId}
          routeGoalName={routeGoalName}
        />
        <RemindersModal
          visible={remindersModalVisible}
          hideModal={hideRemindersModal}
          goalName={goalName}
          goalId={goalId}
        />
        <DeleteGoalModal
          visible={deleteGoalModalVisible}
          hideModal={hideDeleteGoalModal}
          navigation={navigation}
          uid={uid}
          goalId={goalId}
        />
      </Portal>
      <View style={styles.expand}>
        <FastImage source={backgroundImage} style={styles.absoluteFull} />
        <View style={styles.full}>
          <Header navigation={navigation}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{goalName}</Text>
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
                  showEditGoalModal();
                }}
              />
            </View>
          </Header>
          <ScrollView style={{flex: 1, padding: 20}}>
            <TextWidget subtitle={'Flavor text here'} subtitleType="hint" />
            <Divider style={styles.dividerSmall} />
            <View
              style={{
                height: 224,
                alignItems: 'center',
                width: '100%',
              }}>
              <StatsView
                filteredChips={chips.filter(
                  (chip: ChipObject) => chip.goalId === goalId,
                )}
              />
            </View>
            <Divider style={styles.dividerSmall} />
            <ImageCarouselWidget
              navigation={navigation}
              chips={chips.filter((chip: ChipObject) => chip.goalId === goalId)}
            />
          </ScrollView>
        </View>
      </View>
      <ReminderFAB
        uid={uid}
        goalId={goalId}
        navigation={navigation}
        showRemindersModal={showRemindersModal}
        showDeleteGoalModal={showDeleteGoalModal}
      />
    </>
  );
}
