import React from 'react';
import {View, ScrollView, StyleSheet, RefreshControl} from 'react-native';
import {Divider, Text, useTheme} from 'react-native-paper';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import GoalWidget from '../../components/GoalWidgets/GoalWidget';
import AddGoalWidget from '../../components/GoalWidgets/AddGoalWidget';
import ChartWidget from '../../components/GoalWidgets/ChartWidget';

import Header from '../../components/common/Header';
import GoalPage from './GoalDetailPage';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import BackgroundWrapper from '../../components/BackgroundWrapper';

import {styles} from '../../styles';
import {useGetChipsQuery, useGetGoalsQuery} from '../../redux/supabaseApi';

const Stack = createNativeStackNavigator();

function MainPage({navigation}) {
  const {data: goals, refetch: refetchGoals} = useGetGoalsQuery();
  const {data: chips} = useGetChipsQuery();

  const theme = useTheme();

  // Refresh controls
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchGoals();
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, [refetchGoals]);

  return (
    <>
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
            <AddGoalWidget />
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
