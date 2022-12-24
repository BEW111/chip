import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image,
  Platform,
} from 'react-native';
import {Button, TextInput, Divider, HelperText, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';

import {updateNewlyCreated} from '../redux/authSlice';
import {selectNewGoal} from '../redux/onboardingSlice';

import {createNewUser} from '../utils/postUtils';

import backgroundImage from '../../assets/background.png';
import BlurSurface from '../components/BlurSurface';
import {styles} from '../styles';
import BackgroundWrapper from '../components/BackgroundWrapper';

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
    <BackgroundWrapper>
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
            <BlurSurface style={styles.widthAlmostFull}>
              <Text
                variant="headlineSmall"
                style={{
                  fontSize: 24,
                  alignSelf: 'center',
                  marginBottom: 10,
                  fontWeight: 'bold',
                }}>
                {"Let's get started."}
              </Text>
              <Divider style={styles.dividerSmall} />
              <TextInput
                mode="outlined"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={newText => setEmailText(newText)}
                defaultValue={emailText}
                underlineColor="gray"
                activeUnderlineColor="white"
              />
              <Divider style={styles.dividerMedium} />
              <TextInput
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                mode="outlined"
                placeholder="Password"
                onChangeText={newText => setPassText(newText)}
                defaultValue={passText}
                underlineColor="#FFEEF8"
                activeUnderlineColor="white"
              />
              <Divider style={styles.dividerMedium} />
              <TextInput
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                mode="outlined"
                placeholder="Confirm password"
                onChangeText={newText => setConfirmPassText(newText)}
                defaultValue={confirmPassText}
                underlineColor="gray"
                activeUnderlineColor="white"
              />
              <Divider style={styles.dividerMedium} />
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
                }}>
                <View style={{flex: 1, marginRight: 12}}>
                  <Button
                    contentStyle={{alignSelf: 'stretch'}}
                    mode="outlined"
                    onPress={() => navigation.navigate('Onboarding')}>
                    Back
                  </Button>
                </View>
                <View style={{flex: 1}}>
                  <Button mode="contained" onPress={onRegisterPressed}>
                    Register
                  </Button>
                </View>
              </View>
            </BlurSurface>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}
