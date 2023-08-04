import React, {useState} from 'react';
import {KeyboardAvoidingView, ScrollView, View, Platform} from 'react-native';
import {useAppDispatch} from '../../redux/hooks';
import {styles} from '../../styles';

// Components
import {Button, TextInput, Divider, HelperText, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import BlurSurface from '../../components/BlurSurface';
import BackgroundWrapper from '../../components/BackgroundWrapper';

// Tutorial state
import {finishTutorial, startTutorial} from '../../redux/slices/tutorialSlice';

// Auth
import {signUpWithEmail} from '../../supabase/auth';

// Navigation
import {useNavigation} from '@react-navigation/native';

export default function OnboardingRegister() {
  const [usernameText, setUsernameText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');
  const [secureTextEntry, setSecuryTextEntry] = useState(true);
  const [displayError, setDisplayError] = useState('');

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const onSignUpPressed = async () => {
    // Check for more obvious errors
    if (usernameText === '') {
      setDisplayError('Username cannot be empty');
    } else if (emailText === '') {
      setDisplayError('Email cannot be empty');
    } else if (passText === '') {
      setDisplayError('Password cannot be empty');
    } else {
      // Start tutorial
      dispatch(startTutorial());
      const result = await signUpWithEmail(emailText, usernameText, passText);

      if (!result.ok) {
        setDisplayError(result?.message || 'Failed to sign up');
        dispatch(finishTutorial());
        return;
      }
    }
  };

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
                  <Button mode="contained" onPress={onSignUpPressed}>
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
