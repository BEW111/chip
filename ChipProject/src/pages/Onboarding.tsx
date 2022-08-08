import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
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
      <View style={{ width: '100%', paddingHorizontal: 15 }}>
        <Text style={{ color: 'white', fontSize: 24, marginBottom: 10 }}>
          I want to...
        </Text>
        <View>
          <View style={{ 
            display: "flex",
            flexDirection: "row",
            alignItems: 'center'
          }}>
            <TextInput
              placeholder="Enter a goal here"
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              style={{ flex: 1, color: "white", fontSize: 24, paddingHorizontal: 0 }}
              underlineColor='gray'
              activeUnderlineColor='white'
              backgroundColor='black'
            />
            <IconButton
              icon="chevron-right"
              mode="contained"
              size={36}
              containerColor="white"
              iconColor="black"
              style={{margin: 0, marginLeft: 10}}
              onPress={() => navigation.navigate('OnboardingDone')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
