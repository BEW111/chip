import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function OnboardingDone({ navigation }) {
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
        <Button onPress={() => navigation.navigate('MainTabs')}>Get started</Button>
      </View>
    </ScrollView>
  )
}
