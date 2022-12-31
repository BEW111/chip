import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  TextInput,
  Text,
  useTheme,
} from 'react-native-paper';

import {FAB, ActivityIndicator, Divider} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';

import {useSelector, useDispatch} from 'react-redux';
import {selectUid} from '../../redux/authSlice';

import {ChipObject} from './Analytics';
import Header from '../../components/Analytics/Header';
import ImageCarouselWidget from '../../components/GoalWidgets/ImageCarouselWidget';
import TextWidget from '../../components/GoalWidgets/TextWidget';
import DayOccurrenceChartWidget from '../../components/GoalWidgets/DayOccurrenceChartWidget';
import RemindersModal from '../../components/GoalDetail/ReminderModal';

import {
  editGoalName,
  deleteGoal,
  editGoalVisibility,
} from '../../firebase/goals';

import {styles, modalStyles} from '../../styles';
import BackgroundWrapper from '../../components/BackgroundWrapper';

function EditGoalModal({visible, setGoalName, hideModal, uid, goal}) {
  const [goalNameInput, setGoalNameInput] = useState(goal.name);
  const [goalVisibility, setGoalVisibility] = useState<GoalVisibility>(
    goal.visibility,
  );
  const toggleGoalVisibility = () => {
    if (goalVisibility === 'public') {
      setGoalVisibility('private');
    } else {
      setGoalVisibility('public');
    }
  };

  const onSubmitChanges = () => {
    if (goal.name != goalNameInput) {
      editGoalName(uid, goal.id, goalNameInput, dispatch);
      setGoalName(goalNameInput);
      setGoalNameInput('');
    }

    if (goal.visibility != goalVisibility) {
      editGoalVisibility(uid, goal.id, goalVisibility);
    }

    hideModal();
  };

  const dispatch = useDispatch();

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={modalStyles.container}>
      <Text style={modalStyles.header}>Edit goal</Text>
      <View style={styles.row}>
        <View style={styles.expand}>
          <TextInput
            style={modalStyles.textInput}
            label="Goal name"
            value={goalNameInput}
            onChangeText={text => setGoalNameInput(text)}
          />
        </View>
        <IconButton
          icon={
            goalVisibility === 'public'
              ? 'earth-outline'
              : 'lock-closed-outline'
          }
          size={28}
          onPress={toggleGoalVisibility}
        />
      </View>
      <Divider style={styles.dividerSmall} />
      <Button mode="contained" onPress={onSubmitChanges}>
        Save changes
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
  const {goal} = route.params;
  const [goalName, setGoalName] = useState(goal.name);

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
      .where('goalId', '==', goal.id)
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
          goal={goal}
        />
        <RemindersModal
          visible={remindersModalVisible}
          hideModal={hideRemindersModal}
          goalName={goalName}
          goalId={goal.id}
        />
        <DeleteGoalModal
          visible={deleteGoalModalVisible}
          hideModal={hideDeleteGoalModal}
          navigation={navigation}
          uid={uid}
          goalId={goal.id}
        />
      </Portal>
      <BackgroundWrapper>
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
            <DayOccurrenceChartWidget chips={chips} />
            <Divider style={styles.dividerSmall} />
            <ImageCarouselWidget navigation={navigation} chips={chips} />
          </ScrollView>
        </View>
      </BackgroundWrapper>
      <ReminderFAB
        uid={uid}
        goalId={goal.id}
        navigation={navigation}
        showRemindersModal={showRemindersModal}
        showDeleteGoalModal={showDeleteGoalModal}
      />
    </>
  );
}
