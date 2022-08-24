import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, TextInput, Text, Card, HelperText} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';

import {updateNewlyCreated} from '../redux/authSlice';

export default function OnboardingRegister({navigation}) {
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');
  const [confirmPassText, setConfirmPassText] = useState('');

  const dispatch = useDispatch();

  function onRegisterPressed() {
    if (passText !== confirmPassText) {
      console.log('Passwords must match');
    } else {
      auth()
        .createUserWithEmailAndPassword(emailText, passText)
        .then(() => {
          console.log('User account created & signed in!');
          dispatch(updateNewlyCreated(true));
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    }
  }

  const hasErrors = () => {
    return passText !== confirmPassText;
  };

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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              paddingTop: 50,
            }}>
            {"You're all set!"}
          </Text>
        </View>
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
            style={{
              color: 'white',
              fontSize: 18,
              marginBottom: 20,
              textAlign: 'auto',
            }}
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
            style={{
              color: 'white',
              fontSize: 18,
              marginBottom: 20,
              textAlign: 'auto',
            }}
            underlineColor="gray"
            activeUnderlineColor="white"
          />
          <Text style={{color: 'white', fontSize: 18, marginBottom: 5}}>
            Confirm password
          </Text>
          <TextInput
            secureTextEntry={true}
            mode="outlined"
            placeholder=""
            onChangeText={newText => setConfirmPassText(newText)}
            defaultValue={confirmPassText}
            style={{
              color: 'white',
              fontSize: 18,
              marginBottom: 20,
              textAlign: 'auto',
            }}
            underlineColor="gray"
            activeUnderlineColor="white"
          />
          <HelperText
            type="error"
            visible={hasErrors()}
            style={{marginBottom: 10, paddingTop: 0}}>
            Passwords must match
          </HelperText>
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Button
              mode="contained"
              style={{width: 120}}
              onPress={onRegisterPressed}>
              Register
            </Button>
          </View>
        </Card>
        <Card
          style={{
            width: '90%',
            flex: 2,
            backgroundColor: 'gray',

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: 'black'}}>
              Info about chosen goal goes here
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
