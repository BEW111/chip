import React, { useState } from 'react';
import { ScrollView, Text, View, KeyboardAvoidingView } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';


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
      alwaysBounceVertical={false}>
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
              placeholder="Enter a goal you have"
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              style={{ backgroundColor: 'black', flex: 1, color: "white", fontSize: 24, paddingHorizontal: 0 }}
              underlineColor='gray'
              activeUnderlineColor='white'
            />
            <IconButton
              icon="chevron-right"
              size={36}
              style={{margin: 0}}
              onPress={() => navigation.navigate('OnboardingRegister')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
