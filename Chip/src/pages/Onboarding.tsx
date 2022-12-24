import React, {useState} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Text, Button, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useDispatch} from 'react-redux';

import {updateNewGoal} from '../redux/onboardingSlice';

// import GoalGalaxyView from '../components/GoalGalaxy/GoalGalaxyView';
import {styles} from '../styles';
import BackgroundWrapper from '../components/BackgroundWrapper';

export default function Onboarding({navigation}) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  function onAccomplishPressed() {
    dispatch(updateNewGoal(text));
    navigation.navigate('OnboardingRegister');
  }

  return (
    <BackgroundWrapper>
      <ScrollView
        style={styles.full}
        contentContainerStyle={styles.centeredExpand}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled">
        <View style={localStyles(insets.top).mainWrapper}>
          {/* <GoalGalaxyView width={1500} height={1500} margin={50} /> */}
          <View style={localStyles(insets.top).contentWrapper}>
            <Text
              variant="headlineSmall"
              style={localStyles(insets.top).headline}>
              What's something you'd like to accomplish?
            </Text>
            <TextInput
              mode="flat"
              placeholder=""
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={t => setText(t)}
              defaultValue={text}
              style={localStyles(insets.top).prompt}
              underlineColor="gray"
              activeUnderlineColor="white"
              right={
                <TextInput.Icon
                  icon="caret-forward-outline"
                  onPress={onAccomplishPressed}
                />
              }
            />
          </View>
        </View>
        <View
          style={{
            bottom: insets.bottom + 50,
          }}>
          <Button mode="text" onPress={() => navigation.navigate('SignIn')}>
            Sign in to existing account
          </Button>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const localStyles = (top: number) =>
  StyleSheet.create({
    mainWrapper: {
      width: '100%',
      flex: 1,
      marginTop: top,
      paddingHorizontal: 15,
    },
    contentWrapper: {
      width: '100%',
      marginTop: 125,
      marginBottom: 40,
      padding: 15,
    },
    headline: {
      alignSelf: 'center',
      marginBottom: 20,
      fontWeight: 'bold',
    },
    prompt: {
      color: 'black',
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      paddingHorizontal: 2,
    },
  });
