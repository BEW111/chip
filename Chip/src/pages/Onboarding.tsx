import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Text, Button, IconButton, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function Onboarding({navigation}) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{backgroundColor: 'black', height: '100%'}}
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      alwaysBounceVertical={false}>
      <View style={{width: '100%', paddingHorizontal: 15}}>
        <Text style={{color: 'white', fontSize: 24, marginBottom: 10}}>
          I want to...
        </Text>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Enter a goal you have"
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              style={{
                backgroundColor: 'gray',
                flex: 1,
                fontSize: 24,
                paddingHorizontal: 0,
              }}
              underlineColor="gray"
              activeUnderlineColor="white"
            />
            <IconButton
              icon="chevron-right"
              color="white"
              size={36}
              style={{margin: 0}}
              onPress={() => navigation.navigate('OnboardingRegister')}
            />
          </View>
        </View>
      </View>
      <View style={{position: 'absolute', bottom: insets.bottom + 50}}>
        <Button onPress={() => navigation.navigate('SignIn')}>Sign in to existing account</Button>
      </View>
    </ScrollView>
  );
}
