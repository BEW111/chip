import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {styles, modalStyles} from '../../styles';

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
  SegmentedButtons,
} from 'react-native-paper';
import Header from '../../components/common/Header';
import ImageCarouselWidget from '../../components/GoalWidgets/ImageCarouselWidget';
import TextWidget from '../../components/GoalWidgets/TextWidget';
import ChartWidget from '../../components/GoalWidgets/ChartWidget';
// import RemindersModal from '../../components/GoalDetail/ReminderModal';
import BackgroundWrapper from '../../components/BackgroundWrapper';

// Supabase
import {
  useEditGoalMutation,
  useDeleteGoalMutation,
  useGetGoalByIdQuery,
} from '../../redux/slices/goalsSlice';

// Data
import {
  GoalVisibility,
  SupabaseGoal,
  SupabaseGoalModification,
} from '../../types/goals';
import {useGetChipsByGoalIdQuery} from '../../redux/slices/chipsSlice';

// Animations
import Animated, {
  BounceIn,
  BounceInLeft,
  FadeInLeft,
} from 'react-native-reanimated';

type EditGoalModalProps = {
  visible: boolean;
  hideModal: any;
  goal: SupabaseGoal;
};

function EditGoalModal({visible, hideModal, goal}: EditGoalModalProps) {
  const [editGoal] = useEditGoalMutation();

  // Input fields
  const [goalNameInput, setGoalNameInput] = useState(goal.name);
  const [goalVisibilityInput, setGoalVisibilityInput] =
    useState<GoalVisibility>(goal.is_public ? 'public' : 'private');
  const onGoalVisibilityChange = (visibility: GoalVisibility) => {
    setGoalVisibilityInput(visibility);
  };

  // Submitting changes
  const onSubmitChanges = async () => {
    // Editing the goal
    if (
      goal.name !== goalNameInput ||
      (goal.is_public ? 'public' : 'private') !== goalVisibilityInput
    ) {
      const goalChanges: SupabaseGoalModification = {
        id: goal.id,
      };
      if (goal.name !== goalNameInput) {
        goalChanges.name = goalNameInput;
      }
      if ((goal.is_public ? 'public' : 'private') !== goalVisibilityInput) {
        goalChanges.is_public = goalVisibilityInput === 'public';
      }

      await editGoal(goalChanges);
    }

    hideModal();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={modalStyles.container}>
      <Text style={modalStyles.header}>Edit goal</Text>
      <TextInput
        style={modalStyles.textInput}
        label="New goal name"
        value={goalNameInput}
        onChangeText={text => setGoalNameInput(text)}
      />
      <SegmentedButtons
        value={goalVisibilityInput}
        onValueChange={onGoalVisibilityChange}
        buttons={[
          {
            value: 'public',
            label: 'Shareable',
            icon: 'earth-outline',
          },
          {
            value: 'private',
            label: 'Private',
            icon: 'lock-closed-outline',
          },
        ]}
      />
      <Divider style={styles.dividerSmall} />
      <Button mode="contained" onPress={onSubmitChanges}>
        Save changes
      </Button>
    </Modal>
  );
}

function DeleteGoalModal({visible, hideModal, goalId, navigation}) {
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

function ReminderFAB({showEditGoalModal, showDeleteGoalModal}) {
  const [fabOpen, setFabOpen] = useState(false);
  const onFabStateChange = ({open}: {open: boolean}) => setFabOpen(open);

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
            icon: 'pencil-outline',
            label: 'Edit',
            onPress: () => {
              showEditGoalModal();
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
  const {goal: routeGoal}: {goal: SupabaseGoal} = route.params;
  const {data: goal} = useGetGoalByIdQuery(routeGoal.id);

  // Get all chips
  const {data: chips} = useGetChipsByGoalIdQuery(goal ? goal.id : '');

  // Modals
  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);
  const showEditGoalModal = () => setEditGoalModalVisible(true);
  const hideEditGoalModal = () => setEditGoalModalVisible(false);

  // const [remindersModalVisible, setRemindersModalVisible] = useState(false);
  // const showRemindersModal = () => setRemindersModalVisible(true);
  // const hideRemindersModal = () => setRemindersModalVisible(false);

  const [deleteGoalModalVisible, setDeleteGoalModalVisible] = useState(false);
  const showDeleteGoalModal = () => setDeleteGoalModalVisible(true);
  const hideDeleteGoalModal = () => setDeleteGoalModalVisible(false);

  return (
    <>
      {goal && (
        <Portal>
          <EditGoalModal
            visible={editGoalModalVisible}
            hideModal={hideEditGoalModal}
            goal={goal}
          />
          {/* <RemindersModal
            visible={remindersModalVisible}
            hideModal={hideRemindersModal}
            goalId={goal.id}
          /> */}
          <DeleteGoalModal
            visible={deleteGoalModalVisible}
            hideModal={hideDeleteGoalModal}
            navigation={navigation}
            goalId={goal.id}
          />
        </Portal>
      )}
      <BackgroundWrapper>
        <View style={styles.full}>
          <Header>
            {goal && (
              <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                {goal.name}
              </Text>
            )}
            <View style={localStyles.backButtonWrapper}>
              <IconButton
                icon="chevron-back-outline"
                size={28}
                onPress={() => {
                  navigation.navigate('AnalyticsLandingPage');
                }}
              />
            </View>
          </Header>
          <ScrollView style={{flex: 1, padding: 20}}>
            <Animated.View entering={FadeInLeft.duration(300).delay(50)}>
              <TextWidget subtitle={'Flavor text here'} subtitleType="hint" />
            </Animated.View>
            <Divider style={styles.dividerSmall} />
            {goal && chips && (
              <Animated.View entering={FadeInLeft.duration(300).delay(100)}>
                <ChartWidget
                  chips={chips}
                  chartType="bar"
                  title={pluralize(goal.iteration_units, 2) + ' by day'}
                />
              </Animated.View>
            )}
            <Divider style={styles.dividerSmall} />
            {goal && chips && (
              <Animated.View entering={FadeInLeft.duration(300).delay(150)}>
                <ImageCarouselWidget
                  goal={goal}
                  chips={chips}
                  navigation={navigation}
                />
              </Animated.View>
            )}
          </ScrollView>
        </View>
      </BackgroundWrapper>
      <ReminderFAB
        showEditGoalModal={showEditGoalModal}
        showDeleteGoalModal={showDeleteGoalModal}
      />
    </>
  );
}

const localStyles = StyleSheet.create({
  backButtonWrapper: {position: 'absolute', display: 'flex', left: 4},
  editButtonWrapper: {position: 'absolute', display: 'flex', right: 4},
});
