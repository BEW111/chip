import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Social() {
  return (
    <SafeAreaView>
      <View style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Text>Social view area</Text>
      </View>
    </SafeAreaView>
  )
}