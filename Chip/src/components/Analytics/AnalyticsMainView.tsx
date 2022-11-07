/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
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
import {selectUid, selectUserGoals} from '../../redux/authSlice';
import {
  selectSelectedGoal,
  updateSelectedGoal,
} from '../../redux/analyticsSlice';

import Settings from '../../components/Settings';

import ChipDisplayMini from '../../components/Analytics/ChipDisplayMini';
import ChipDisplayLarge from '../../components/Analytics/ChipDisplayLarge';
import DayOccurrenceChart from '../../components/Analytics/DayOccurrenceChart';
import Header from '../../components/Analytics/Header';

import backgroundImage from '../../../assets/background.png';
import chipsIcon from '../../../assets/chips-icon.png';

import {addGoal} from '../../utils/postUtils';

export default function AnalyticsMainView() {
  return (
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
          <StatsView
            filteredChips={chips.filter(
              (chip: ChipObject) => chip.goal === selectedGoal,
            )}
          />
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
            {chips
              .filter((chip: ChipObject) => chip.goal === selectedGoal)
              .map((chip: ChipObject) => {
                const date = chip.timeSubmitted
                  .toDate()
                  .toLocaleDateString('en-US', {dateStyle: 'short'});
                const time = chip.timeSubmitted
                  .toDate()
                  .toLocaleTimeString('en-US', {timeStyle: 'short'});
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
  );
}
