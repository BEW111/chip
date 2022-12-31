import React, {useState} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Text, Button, TextInput, Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

import {useDispatch} from 'react-redux';

import {updateNewGoal} from '../../redux/onboardingSlice';

// import GoalGalaxyView from '../components/GoalGalaxy/GoalGalaxyView';
import {styles} from '../../styles';
import BackgroundWrapper from '../../components/BackgroundWrapper';

import OnboardingCarousel from '../../components/Onboarding/OnboardingCarousel';

import chipHeader from '../../../assets/chip-header-transparent.png';

export default function Onboarding({navigation}) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  function onAccomplishPressed() {
    dispatch(updateNewGoal(text));
    navigation.navigate('OnboardingRegister');
  }

  return (
    <BackgroundWrapper light>
      <ScrollView
        style={styles.full}
        contentContainerStyle={styles.centeredExpand}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled">
        <View style={localStyles(insets.top).mainWrapper}>
          <View style={styles.rowCentered}>
            <FastImage source={chipHeader} style={localStyles(0).header} />
          </View>
          <Divider style={styles.dividerMedium} />
          <View>
            <OnboardingCarousel />
          </View>
        </View>
        <View
          style={{
            bottom: insets.bottom + 40,
          }}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('OnboardingRegister')}>
            Sign up
          </Button>
          <Divider style={styles.dividerSmall} />
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
      paddingTop: 40,
    },
    contentWrapper: {
      width: '100%',
      marginTop: 125,
      marginBottom: 40,
      padding: 15,
    },
    // headline: {
    //   alignSelf: 'center',
    //   marginBottom: 20,
    //   fontWeight: 'bold',
    // },
    // prompt: {
    //   color: 'black',
    //   fontSize: 24,
    //   marginBottom: 20,
    //   textAlign: 'auto',
    //   backgroundColor: 'rgba(0, 0, 0, 0)',
    //   paddingHorizontal: 2,
    // },
    header: {
      height: 908 * 0.1,
      width: 2760 * 0.1,
    },
  });

/* <GoalGalaxyView width={1500} height={1500} margin={50} /> */
/* <View style={localStyles(0).contentWrapper}>
            <Text variant="headlineSmall" style={localStyles(0).headline}>
              What's something you'd like to accomplish?
            </Text>
            <TextInput
              mode="flat"
              placeholder=""
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={t => setText(t)}
              defaultValue={text}
              style={localStyles(0).prompt}
              underlineColor="gray"
              activeUnderlineColor="white"
              right={
                <TextInput.Icon
                  icon="caret-forward-outline"
                  onPress={onAccomplishPressed}
                />
              }
            />
          </View> */
