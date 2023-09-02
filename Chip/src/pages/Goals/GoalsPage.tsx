import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {styles} from '../../styles';

// Common components
import {Divider, Modal, Portal, Text, useTheme} from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Widgets
import GoalWidget from '../../components/GoalWidgets/GoalWidget';
import AddGoalWidget from '../../components/GoalWidgets/AddGoalWidget';
import ChartWidget from '../../components/GoalWidgets/ChartWidget';

// Misc components
import OnboardingCarouselModal from '../../components/Onboarding/OnboardingCarouselModal';
import Header from '../../components/common/Header';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import Tooltip from '../../components/common/Tooltip';

// Specific goal page
import GoalPage from './GoalDetailPage';

// Api
import supabaseApi from '../../redux/supabaseApi';
import {useGetChipsQuery} from '../../redux/slices/chipsSlice';
import {useGetGoalsQuery} from '../../redux/slices/goalsSlice';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';

// Tutorial info
import {
  selectInTutorial,
  selectTutorialStage,
} from '../../redux/slices/tutorialSlice';

const Stack = createNativeStackNavigator();

function MainPage({navigation}) {
  const {data: goals, refetch: refetchGoals} = useGetGoalsQuery();
  const {data: chips, refetch: refetchChips} = useGetChipsQuery();

  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Refresh controls
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchGoals();
    await refetchChips();
    dispatch(supabaseApi.util.invalidateTags(['Costreak']));
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, [refetchGoals, refetchChips, dispatch]);

  // Tutorial
  const tutorialStage = useAppSelector(selectTutorialStage);
  const inTutorial = useAppSelector(selectInTutorial);

  return (
    <>
      <Portal>
        <OnboardingCarouselModal
          visible={tutorialStage === 'goals-onboarding-carousel'}
        />
      </Portal>
      <FocusAwareStatusBar animated={true} barStyle="dark-content" />
      <BackgroundWrapper>
        <View style={styles.full}>
          <Header>
            <Text style={localStyles.headerText}>Goals</Text>
          </Header>
          <ScrollView
            contentContainerStyle={localStyles.scrollViewPadded}
            style={styles.expand}
            scrollEnabled={!inTutorial}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.secondaryContainer}
                colors={[theme.colors.secondaryContainer]}
              />
            }>
            {chips && (
              <ChartWidget
                chartType="day-occurrence"
                title="your activity"
                chips={chips}
              />
            )}

            <Divider style={styles.dividerSmall} />
            {goals &&
              goals.map(goal => (
                <View key={goal.id}>
                  <GoalWidget goal={goal} navigation={navigation} />
                  <Divider style={styles.dividerSmall} />
                </View>
              ))}
            <Tooltip
              visible={tutorialStage === 'goals-wait-start-create'}
              text="Start by creating your first goal">
              <AddGoalWidget />
            </Tooltip>
          </ScrollView>
        </View>
      </BackgroundWrapper>
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <Stack.Navigator initialRouteName="AnalyticsLandingPage">
      <Stack.Screen
        name="AnalyticsLandingPage"
        component={MainPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AnalyticsGoalPage"
        component={GoalPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const localStyles = StyleSheet.create({
  scrollViewPadded: {padding: 16},
  headerText: {fontSize: 24, fontWeight: 'bold'},
  pdfContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
