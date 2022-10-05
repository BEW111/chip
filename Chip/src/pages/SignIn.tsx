import React, {useState} from 'react';
import {ScrollView, View, Image, KeyboardAvoidingView, Platform} from 'react-native';
import {Button, TextInput, Text, Card, HelperText, Headline} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import backgroundImage from '../../assets/background.png';
// import chipsIcon from '../../assets/chips-icon.png';

import auth from '@react-native-firebase/auth';

export default function SignIn({navigation}) {
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
    <View style={{flex: 1}}>
      <Image
        source={backgroundImage}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      />
      <SafeAreaView>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{width: '100%'}}>
          <ScrollView
            style={{height: '100%'}}
            contentContainerStyle={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps='handled'>
            <Card
              style={{
                width: '90%',
                marginTop: 25,
                marginBottom: 40,
                padding: 15,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              }}>
              <Headline style={{alignSelf: 'center', marginBottom: 20, fontWeight: 'bold'}}>Welcome back.</Headline>
              <TextInput
                mode="outlined"
                placeholder="Email"
                onChangeText={newText => setEmailText(newText)}
                defaultValue={emailText}
                style={{color: 'black', fontSize: 18, marginBottom: 20, textAlign: 'auto'}}
                underlineColor="gray"
                activeUnderlineColor="white"
              />
              <TextInput
                secureTextEntry={true}
                mode="outlined"
                placeholder="Password"
                onChangeText={newText => setPassText(newText)}
                defaultValue={passText}
                style={{color: 'white', fontSize: 18, marginBottom: 50, textAlign: 'auto'}}
                underlineColor="gray"
                activeUnderlineColor="white"
              />
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Onboarding')}>
                  Create an account
                </Button>
                <Button
                  mode="contained"
                  style={{paddingHorizontal: 10}}
                  onPress={onRegisterPressed}>
                  Sign in
                </Button>
              </View>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
