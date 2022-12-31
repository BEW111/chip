import React, {useState} from 'react';
import {KeyboardAvoidingView, ScrollView, View, Platform} from 'react-native';
import {Button, TextInput, Divider, HelperText, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';

import {updateNewlyCreated} from '../../redux/authSlice';
import {selectNewGoal} from '../../redux/onboardingSlice';

import {createNewUser} from '../../firebase/auth';

import BlurSurface from '../../components/BlurSurface';
import {styles} from '../../styles';
import BackgroundWrapper from '../../components/BackgroundWrapper';

export default function OnboardingRegister({navigation}) {
  const [usernameText, setUsernameText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');
  const [confirmPassText, setConfirmPassText] = useState('');
  const [displayError, setDisplayError] = useState('');

  const newGoal = useSelector(selectNewGoal);

  async function onRegisterPressed() {
    // Check for more obvious errors
    if (usernameText === '') {
      setDisplayError('Username cannot be empty');
    } else if (emailText === '') {
      setDisplayError('Email cannot be empty');
    } else if (passText === '') {
      setDisplayError('Password cannot be empty');
    } else if (passText !== confirmPassText) {
      setDisplayError('Passwords must match');
    } else {
      const result = await createNewUser(
        usernameText,
        emailText,
        passText,
        newGoal,
      );

      if (result.status === 'error') {
        if (result.code === 'auth/email-already-in-use') {
          setDisplayError('Email already in use');
        } else if (result.code === 'auth/invalid-email') {
          setDisplayError('Please enter a valid email');
        } else if (result.code === 'auth/weak-password') {
          setDisplayError('Please enter a stronger password');
        } else if (result.code === 'user/username-taken') {
          setDisplayError('This username is already taken');
        }
      }
    }
  }

  return (
    <BackgroundWrapper>
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.widthFull}>
          <ScrollView
            style={styles.full}
            contentContainerStyle={styles.centeredExpand}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled">
            <BlurSurface style={styles.widthAlmostFull}>
              <View>
                <Text variant="titleLarge" style={styles.textCentered}>
                  Sign up for Chip
                </Text>
                <Text variant="titleSmall" style={styles.textCentered}>
                  Start building habits with your friends
                </Text>
              </View>
              <Divider style={styles.dividerSmall} />
              <TextInput
                mode="outlined"
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={newText => setUsernameText(newText)}
                defaultValue={usernameText}
                underlineColor="gray"
                activeUnderlineColor="white"
              />
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
              <Divider style={styles.dividerSmall} />
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
              <Divider style={styles.dividerSmall} />
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
              <HelperText type="error" visible={displayError !== ''}>
                {displayError}
              </HelperText>
              <Divider style={styles.dividerSmall} />
              <View style={styles.row}>
                <View style={{flex: 1, marginRight: 12}}>
                  <Button
                    contentStyle={{alignSelf: 'stretch'}}
                    mode="text"
                    onPress={() => navigation.navigate('Onboarding')}>
                    Back
                  </Button>
                </View>
                <View style={styles.expand}>
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
