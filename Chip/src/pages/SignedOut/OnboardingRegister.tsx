import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
  Pressable,
} from 'react-native';
import {useAppDispatch} from '../../redux/hooks';
import {styles} from '../../styles';

// Components
import {
  Button,
  TextInput,
  Divider,
  HelperText,
  Text,
  ActivityIndicator,
  useTheme,
  Portal,
} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import BlurSurface from '../../components/BlurSurface';
import BackgroundWrapper from '../../components/BackgroundWrapper';
import {BlurView} from '@react-native-community/blur';

// Tutorial state
import {finishTutorial, startTutorial} from '../../redux/slices/tutorialSlice';

// Auth
import {signUpWithEmail, verifyOtp} from '../../supabase/auth';

// Navigation
import {useNavigation} from '@react-navigation/native';
import EulaReader from '../../components/Onboarding/EulaReader';

export default function OnboardingRegister() {
  const [usernameText, setUsernameText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');
  const [secureTextEntry, setSecuryTextEntry] = useState(true);
  const [displayError, setDisplayError] = useState('');

  const [signingUp, setSigningUp] = useState(false);

  const [otpText, setOtpText] = useState('');
  const [waitingForVerify, setWaitingForVerify] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const theme = useTheme();

  const onSignUpPressed = async () => {
    // Check for more obvious errors
    if (usernameText === '') {
      setDisplayError('Username cannot be empty');
    } else if (emailText === '') {
      setDisplayError('Email cannot be empty');
    } else if (passText === '') {
      setDisplayError('Password cannot be empty');
    } else if (usernameText.length < 3) {
      setDisplayError('Your username is too short');
    } else {
      setSigningUp(true);

      const result = await signUpWithEmail(emailText, usernameText, passText);
      setSigningUp(false);

      if (!result.ok) {
        console.log(result);
        setDisplayError(result?.message || 'Failed to sign up');
        return;
      }

      setWaitingForVerify(true);
    }
  };

  const onVerifyPressed = async () => {
    // To do: fix this later
    if (otpText.length !== 6) {
      await signUpWithEmail(emailText, usernameText, passText);
      return;
    }

    setVerifying(true);
    dispatch(startTutorial());

    const result = await verifyOtp(emailText, otpText);

    if (!result.ok) {
      dispatch(finishTutorial());
    }

    setVerifying(false);
  };

  async function onToggleSecureTextEntry() {
    setSecuryTextEntry(!secureTextEntry);
  }

  // EULA
  const [eulaReaderVisible, setEulaReaderVisible] = useState(false);
  const onViewEulaPressed = () => {
    setEulaReaderVisible(true);
  };
  const onCloseEulaPressed = () => {
    setEulaReaderVisible(false);
  };
  const insets = useSafeAreaInsets();

  return eulaReaderVisible ? (
    <BackgroundWrapper>
      <View style={styles.absoluteFullDark}>
        <EulaReader onCloseReader={onCloseEulaPressed} />
        <BlurView
          blurType="dark"
          blurAmount={8}
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: insets.top,
          }}
        />
      </View>
    </BackgroundWrapper>
  ) : (
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
              {waitingForVerify ? (
                <>
                  <HelperText type="info">
                    Please enter the verification code sent to {emailText}
                  </HelperText>
                  <TextInput
                    mode="outlined"
                    placeholder="Verification code"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={newText => setOtpText(newText)}
                    defaultValue={otpText}
                    underlineColor="gray"
                    activeUnderlineColor="white"
                  />
                  <Divider style={styles.dividerMedium} />
                  {signingUp ? (
                    <ActivityIndicator />
                  ) : (
                    <View style={styles.row}>
                      <View style={{flex: 1, marginRight: 12}}>
                        <Button
                          contentStyle={{alignSelf: 'stretch'}}
                          mode="text"
                          onPress={() => setWaitingForVerify(false)}>
                          Back
                        </Button>
                      </View>
                      <View style={styles.expand}>
                        <Button mode="contained" onPress={onVerifyPressed}>
                          {otpText.length !== 6 ? 'Resend' : 'Register'}
                        </Button>
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <>
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
                  <Divider style={styles.dividerTiny} />
                  <HelperText type="info">
                    By pressing "register", you agree to the terms listed in our{' '}
                    <HelperText
                      type="info"
                      style={{
                        color: theme.colors.tertiary,
                        fontWeight: 'bold',
                      }}
                      onPress={onViewEulaPressed}>
                      End-User License Agreement
                    </HelperText>
                    .
                  </HelperText>
                  <Divider style={styles.dividerSmall} />
                  {signingUp ? (
                    <ActivityIndicator />
                  ) : (
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
                          {waitingForVerify ? 'Resend' : 'Register'}
                        </Button>
                      </View>
                    </View>
                  )}
                </>
              )}
            </BlurSurface>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}
