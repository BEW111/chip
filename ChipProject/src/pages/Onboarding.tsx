import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Input } from '@rneui/base';
import { Card } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Onboarding({ navigation }) {
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
          I want to...
        </Text>
        <View style={{
          width: '97%'
        }}>
          <View style={{ 
            display: "flex",
            flexDirection: "row",
            alignItems: 'center'
          }}>
            <Input
              placeholder="Enter a goal here"
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              containerStyle={{ width: "87%", marginBottom: "-5%" }}
              inputStyle={{ color: "white", fontSize: 24 }}
            />
            <Icon 
              name="arrow-forward" 
              type="evil-icons" 
              color="white" 
              size={48} 
              onPress={() => navigation.navigate('OnboardingDone')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
