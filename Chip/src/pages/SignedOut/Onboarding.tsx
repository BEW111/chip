import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

// import GoalGalaxyView from '../components/GoalGalaxy/GoalGalaxyView';
import {styles} from '../../styles';
import BackgroundWrapper from '../../components/BackgroundWrapper';

import chipHeader from '../../../assets/chip-header-transparent.png';

export default function Onboarding({navigation}) {
  const insets = useSafeAreaInsets();

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
        </View>
        <View
          style={{
            bottom: insets.bottom + 150,
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
    header: {
      height: 908 * 0.1,
      width: 2760 * 0.1,
    },
  });
