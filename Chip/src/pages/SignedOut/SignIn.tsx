import React, {useState} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {Button, TextInput, HelperText, Text, Divider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {styles} from '../../styles';

import {signInWithEmail} from '../../supabase/auth';

import BlurSurface from '../../components/BlurSurface';
import BackgroundWrapper from '../../components/BackgroundWrapper';

export default function SignIn({navigation}) {
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');

  const [displayError, setDisplayError] = useState('');

  const onSignInPressed = async () => {
    const result = await signInWithEmail(emailText, passText);

    if (!result.ok) {
      setDisplayError(result?.message || 'Failed to sign in');
    }
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.full}>
          <ScrollView
            style={styles.full}
            contentContainerStyle={styles.centeredExpand}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled">
            <BlurSurface style={styles.widthAlmostFull}>
              <Text
                variant="headlineSmall"
                style={{
                  alignSelf: 'center',
                  marginBottom: 20,
                  marginTop: 10,
                }}>
                Welcome back.
              </Text>
              <TextInput
                mode="outlined"
                placeholder="Email"
                keyboardType="email-address"
                textContentType="emailAddress"
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
                mode="outlined"
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={newText => setPassText(newText)}
                defaultValue={passText}
                underlineColor="gray"
                activeUnderlineColor="white"
              />
              <Divider style={styles.dividerSmall} />
              <HelperText type="error">{displayError}</HelperText>
              <Divider style={styles.dividerSmall} />
              <Button mode="contained" onPress={onSignInPressed}>
                Sign in
              </Button>
            </BlurSurface>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <View style={localStyles.signupView}>
        <View style={styles.rowCentered}>
          <Text variant="bodyLarge">Don't have an account?</Text>
          <Button mode="text" onPress={() => navigation.navigate('Onboarding')}>
            Sign up
          </Button>
        </View>
      </View>
    </BackgroundWrapper>
  );
}

const localStyles = StyleSheet.create({
  signupView: {position: 'absolute', bottom: 60, width: '100%'},
  blurSurface: {
    width: '85%',
    marginTop: 25,
    marginBottom: 40,
    padding: 15,
    borderRadius: 10,
  },
});
