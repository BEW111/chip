import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function Sidebar() {
  return (
    <ScrollView style={{
      backgroundColor: 'rgb(50, 50, 50)',
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
  )
}

export default function Analytics() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <View style={{
      height: '100%', 
      paddingTop: insets.top
      }}>
        <View style={{
          flex: 1,
          
          display: 'flex', 
          flexDirection: 'row', 
        }}>
          {/* Sidebar */}
          <Sidebar />
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
      </View>
    </View>
  )
}