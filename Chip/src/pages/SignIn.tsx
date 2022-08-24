import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, TextInput, Text, Card, HelperText} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';

export default function OnboardingRegister({navigation}) {
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');

  function onRegisterPressed() {
    console.log(emailText);
    console.log(passText);

    auth()
      .signInWithEmailAndPassword(emailText, passText)
      .then(() => {
        console.log('Existing user account signed in!');
      })
      .catch(error => {
        console.log(error.code);
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={{backgroundColor: 'black'}}>
      <ScrollView
        style={{backgroundColor: 'black', height: '100%'}}
        contentContainerStyle={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '40px',
        }}
        alwaysBounceVertical={false}>
        <Card
          style={{
            width: '90%',
            marginTop: 25,
            marginBottom: 40,
            padding: 15,
          }}>
          <Text style={{color: 'white', fontSize: 18, marginBottom: 5}}>
            Email
          </Text>
          <TextInput
            mode="outlined"
            placeholder=""
            onChangeText={newText => setEmailText(newText)}
            defaultValue={emailText}
            style={{color: 'white', fontSize: 18, marginBottom: 20, textAlign: 'auto'}}
            underlineColor="gray"
            activeUnderlineColor="white"
          />
          <Text style={{color: 'white', fontSize: 18, marginBottom: 5}}>
            Password
          </Text>
          <TextInput
            secureTextEntry={true}
            mode="outlined"
            placeholder=""
            onChangeText={newText => setPassText(newText)}
            defaultValue={passText}
            style={{color: 'white', fontSize: 18, marginBottom: 20, textAlign: 'auto'}}
            underlineColor="gray"
            activeUnderlineColor="white"
          />
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Button
              mode="contained"
              style={{width: 120}}
              onPress={onRegisterPressed}>
              Sign in
            </Button>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
