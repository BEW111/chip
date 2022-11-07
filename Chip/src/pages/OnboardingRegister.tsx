import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image,
  Platform,
} from 'react-native';
import {
  Button,
  TextInput,
  Text,
  Card,
  HelperText,
  Headline,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';

import {updateNewlyCreated} from '../redux/authSlice';
import {selectNewGoal} from '../redux/onboardingSlice';

import {createNewUser} from '../utils/postUtils';

import backgroundImage from '../../assets/background.png';

export default function OnboardingRegister({navigation}) {
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');
  const [confirmPassText, setConfirmPassText] = useState('');
  const [displayError, setDisplayError] = useState('');

  const newGoal = useSelector(selectNewGoal);

  async function onRegisterPressed() {
    // Check for more obvious errors
    if (emailText === '') {
      setDisplayError('Email cannot be empty');
    } else if (passText === '') {
      setDisplayError('Password cannot be empty');
    } else if (passText !== confirmPassText) {
      setDisplayError('Passwords must match');
    } else {
      const result = await createNewUser(emailText, passText, newGoal);

      if (result.status === 'error') {
        if (result.code === 'auth/email-already-in-use') {
          setDisplayError('Email already in use');
        } else if (result.code === 'auth/invalid-email') {
          setDisplayError('Please enter a valid email');
        } else if (result.code === 'auth/weak-password') {
          setDisplayError('Please enter a stronger password');
        }
      }
    }
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{width: '100%'}}>
          <ScrollView
            style={{height: '100%'}}
            contentContainerStyle={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled">
            <Card
              style={{
                width: '90%',
                marginTop: 25,
                marginBottom: 40,
                padding: 15,
                paddingTop: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              }}>
              <Headline
                style={{
                  fontSize: 24,
                  alignSelf: 'center',
                  marginBottom: 10,
                  fontWeight: 'bold',
                }}>
                {"Let's get started."}
              </Headline>
              <TextInput
                mode="outlined"
                placeholder="Email"
                onChangeText={newText => setEmailText(newText)}
                defaultValue={emailText}
                style={{
                  color: 'black',
                  fontSize: 18,
                  marginBottom: 20,
                  textAlign: 'auto',
                }}
                underlineColor="gray"
                activeUnderlineColor="white"
              />
              <TextInput
                secureTextEntry={true}
                mode="outlined"
                placeholder="Password"
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
              <TextInput
                secureTextEntry={true}
                mode="outlined"
                placeholder="Confirm password"
                onChangeText={newText => setConfirmPassText(newText)}
                defaultValue={confirmPassText}
                style={{
                  color: 'white',
                  fontSize: 18,
                  marginBottom: 10,
                  textAlign: 'auto',
                }}
                underlineColor="gray"
                activeUnderlineColor="white"
              />
              <HelperText
                type="error"
                visible={displayError !== ''}
                style={{marginBottom: 10, paddingTop: 0}}>
                {displayError}
              </HelperText>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Onboarding')}>
                  Back
                </Button>
                <Button mode="contained" onPress={onRegisterPressed}>
                  Register
                </Button>
              </View>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
