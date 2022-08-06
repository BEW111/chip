import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Input } from '@rneui/base';
import { Card } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function OnboardingDone() {
  const [text, setText] = useState('');
  return (
    <ScrollView 
      style={{ backgroundColor: 'black', height: '100%' }} 
      contentContainerStyle={{ 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center' 
      }}
      alwaysBounceVertical={false}
    >
      <View>
        <Text style={{ color: 'white', fontSize: 24, marginLeft: 10, marginBottom: 5 }}>
          You're all set!
        </Text>
      </View>
    </ScrollView>
  )
}
