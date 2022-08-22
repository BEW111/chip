/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  IconButton,
  Surface,
  Text,
  Headline,
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  AnimatedFAB,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

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

function TempChip() {
  return (
    <Surface
      style={{
        backgroundColor: 'white',
        height: 100,
        width: '32%',
        margin: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Chip</Text>
    </Surface>
  );
}

function Stats1() {
  return (
    <View style={{flex: 1, backgroundColor: 'pink'}}>
      <Text> stats1 </Text>
    </View>
  )
}

function Stats2() {
  return (
    <View style={{flex: 1, backgroundColor: 'rgb(200, 200, 255)'}}>
      <Text> stats2 </Text>
    </View>
  )
}

function StatsView() {
  return (
    <View style={{width: '100%', height: '100%'}}>
      <Tab.Navigator tabBar={() => null}>
        <Tab.Screen name="Stats1" component={Stats1} />
        <Tab.Screen name="Stats2" component={Stats2} />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})


export default function Analytics() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
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
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
                <TempChip />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <AnimatedFAB
        style={styles.fab}
        icon="share"
        onPress={() => console.log('Pressed')}
        label={'Share'}
        extended={false}
      />
    </View>
  );
}
