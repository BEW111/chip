import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Social() {
  return (
    <SafeAreaView>
      <View style={{height: '100%'}}>
        <View style={{
          flex: 1,

          display: 'flex', 
          flexDirection: 'row', 
        }}>
          {/* Sidebar */}
          <ScrollView style={{
            backgroundColor: 'red', 
            flex: 1,
          }}>
            <View style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <IconButton
                icon="plus"
                color="purple"
                size={36}
                reverse
              />
              <View style={{width: 70, height: 70, backgroundColor: 'purple'}}/>
            </View>
          </ScrollView>
          {/* Main view */}
          <View style={{backgroundColor: 'blue', flex: 3, display: 'flex'}}>
            <View style={{backgroundColor: 'green'}}>
              <Text>Habit name goes here</Text>
            </View>
            <ScrollView style={{
              backgroundColor: 'gray', 
              flex: 1,
            }}>
              
            </ScrollView>
          </View>
        </View>
        {/* Nav */}
        <View style={{backgroundColor: 'yellow', height: 50}}>
        </View>
      </View>
    </SafeAreaView>
  )
}