import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {styles, modalStyles} from '../../styles';
import {useAppSelector} from '../../redux/hooks';

// Misc
import pluralize from 'pluralize';

// Components
import {
  Button,
  IconButton,
  Modal,
  Portal,
  TextInput,
  Text,
  useTheme,
  FAB,
  Divider,
} from 'react-native-paper';
import Header from '../../components/Analytics/Header';
import ImageCarouselWidget from '../../components/GoalWidgets/ImageCarouselWidget';
import TextWidget from '../../components/GoalWidgets/TextWidget';
import ChartWidget from '../../components/GoalWidgets/ChartWidget';
import RemindersModal from '../../components/GoalDetail/ReminderModal';
import BackgroundWrapper from '../../components/BackgroundWrapper';

// Supabase
import {
  useEditGoalMutation,
  useDeleteGoalMutation,
} from '../../redux/supabaseApi';

// Data
import {selectUid} from '../../redux/slices/authSlice';
import {SupabaseGoal, SupabaseGoalModification} from '../../types/goals';
import {useGetChipsByGoalIdQuery} from '../../redux/supabaseApi';

function EditGoalModal({visible, setGoalName, hideModal, uid, goal}) {
  const [editGoal] = useEditGoalMutation();

  // Input fields
  const [goalNameInput, setGoalNameInput] = useState(goal.name);
  const [goalIsPublicInput, setGoalIsPublicInput] = useState<boolean>(
    goal.isPublic,
  );
  const toggleGoalVisibility = () => {
    setGoalIsPublicInput(!goalIsPublicInput);
  };

  // Submitting changes
  const onSubmitChanges = async () => {
    // Editing the goal
    if (goal.name !== goalNameInput || goal.isPublic !== goalIsPublicInput) {
      const goalChanges: SupabaseGoalModification = {
        id: goal.id,
      };
      if (goal.name !== goalNameInput) {
        goalChanges.name = goalNameInput;
      }
      if (goal.visibility !== goalIsPublicInput) {
        goalChanges.is_public = goalIsPublicInput;
      }

      await editGoal(goalChanges);
      setGoalName(goalNameInput);
    }

    hideModal();
  };

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
          icon={goalIsPublicInput ? 'earth-outline' : 'lock-closed-outline'}
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
  const [deleteGoal] = useDeleteGoalMutation();

  const onDeleteGoal = async () => {
    await deleteGoal(goalId);
    navigation.navigate('AnalyticsLandingPage');
  };

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={modalStyles.container}>
      <Text style={modalStyles.header}>
        Are you sure you'd like to delete this goal?
      </Text>
      <Button mode="contained" onPress={onDeleteGoal}>
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
  const {goal}: {goal: SupabaseGoal} = route.params;
  const [goalName, setGoalName] = useState(goal.name);

  const uid = useAppSelector(selectUid);

  // Get all chips
  const {data: chips} = useGetChipsByGoalIdQuery(goal.id);

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
            <View style={localStyles.backButtonWrapper}>
              <IconButton
                icon="chevron-back-outline"
                size={28}
                onPress={() => {
                  navigation.navigate('AnalyticsLandingPage');
                }}
              />
            </View>
            <View style={localStyles.editButtonWrapper}>
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
            {chips && (
              <ChartWidget
                chips={chips}
                chartType="bar"
                title={pluralize(goal.iteration_units, 2) + ' by day'}
              />
            )}
            <Divider style={styles.dividerSmall} />
            {chips && (
              <ImageCarouselWidget
                goal={goal}
                chips={chips}
                navigation={navigation}
              />
            )}
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

const localStyles = StyleSheet.create({
  backButtonWrapper: {position: 'absolute', display: 'flex', left: 4},
  editButtonWrapper: {position: 'absolute', display: 'flex', right: 4},
});
