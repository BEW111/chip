import React from 'react';
import {View, ScrollView, StyleSheet, RefreshControl} from 'react-native';
import {styles} from '../../styles';

// Common components
import {Divider, Portal, Text, useTheme} from 'react-native-paper';
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
import {useAppSelector} from '../../redux/hooks';

// Tutorial info
import {selectTutorialStage} from '../../redux/slices/tutorialSlice';

const Stack = createNativeStackNavigator();

function MainPage({navigation}) {
  // console.log('[GoalsPage MainPage] Main page');

  const {data: goals, refetch: refetchGoals} = useGetGoalsQuery();
  const {data: chips, refetch: refreshChips} = useGetChipsQuery();

  // console.log('[GoalsPage MainPage] chips:', chips);

  const theme = useTheme();

  // Refresh controls
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    supabaseApi.util.invalidateTags(['Chip', 'Goal']);
    await refetchGoals();
    await refreshChips();
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, [refetchGoals, refreshChips]);

  // Tutorial
  const tutorialStage = useAppSelector(selectTutorialStage);

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
              text="Start by creating a your first goal">
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
});
