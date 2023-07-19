import React, {useState} from 'react';
import {KeyboardAvoidingView, ScrollView, View, Platform} from 'react-native';
import {Button, TextInput, Divider, HelperText, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';

import {updateNewlyCreated} from '../../redux/slices/authSlice';
import {selectNewGoal} from '../../redux/slices/onboardingSlice';

import {createNewUser} from '../../firebase/auth';

import BlurSurface from '../../components/BlurSurface';
import {styles} from '../../styles';
import BackgroundWrapper from '../../components/BackgroundWrapper';

export default function OnboardingRegister({navigation}) {
  const [usernameText, setUsernameText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');
  const [secureTextEntry, setSecuryTextEntry] = useState(true);
  const [displayError, setDisplayError] = useState('');

  const newGoal = useSelector(selectNewGoal);

  const dispatch = useDispatch();

  async function onRegisterPressed() {
    // Check for more obvious errors
    if (usernameText === '') {
      setDisplayError('Username cannot be empty');
    } else if (emailText === '') {
      setDisplayError('Email cannot be empty');
    } else if (passText === '') {
      setDisplayError('Password cannot be empty');
    } else {
      const result = await createNewUser(
        usernameText,
        emailText,
        passText,
        newGoal,
      );

      dispatch(updateNewlyCreated(true));

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

  async function onToggleSecureTextEntry() {
    setSecuryTextEntry(!secureTextEntry);
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
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                autoCorrect={false}
                mode="outlined"
                placeholder="Password"
                onChangeText={newText => setPassText(newText)}
                defaultValue={passText}
                underlineColor="#FFEEF8"
                activeUnderlineColor="white"
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? 'eye-off' : 'eye'}
                    onPress={onToggleSecureTextEntry}
                  />
                }
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
