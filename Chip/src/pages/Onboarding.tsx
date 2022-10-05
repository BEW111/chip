import React, {useState} from 'react';
import {ScrollView, View, Image} from 'react-native';
import {Text, Button, IconButton, TextInput, Headline, Card} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useSelector, useDispatch} from 'react-redux';

import {updateNewGoal} from '../redux/onboardingSlice';

import backgroundImage from '../../assets/background.png';
import GoalGalaxyView from '../components/GoalGalaxy/GoalGalaxyView';

export default function Onboarding({navigation}) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  function onAccomplishPressed() {
    dispatch(updateNewGoal(text));
    navigation.navigate('OnboardingRegister');
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
      <ScrollView
        style={{height: '100%'}}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps='handled'>
        <View style={{width: '100%', flex: 1, marginTop: insets.top, paddingHorizontal: 15}}>
          {/* <GoalGalaxyView width={1500} height={1500} margin={50} /> */}
          <View
            style={{
              display: 'flex',
              top: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                marginTop: 25,
                marginBottom: 40,
                padding: 15,
              }}>
              <Headline style={{alignSelf: 'center', marginBottom: 20, fontWeight: 'bold'}}>What's something you'd like to accomplish?</Headline>
              <TextInput
                mode="flat"
                placeholder=""
                onChangeText={text => setText(text)}
                defaultValue={text}
                style={{
                  color: 'black', 
                  fontSize: 24, 
                  marginBottom: 20, 
                  textAlign: 'auto', 
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  paddingHorizontal: 2,
                }}
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
        </View>
        <View
          style={{
            bottom: insets.bottom + 50,
          }}>
          <Button mode='outlined' onPress={() => navigation.navigate('SignIn')}>
            Sign in to existing account
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
