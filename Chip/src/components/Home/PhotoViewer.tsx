import React, {useState} from 'react';
import {View, Pressable, Dimensions, StyleSheet} from 'react-native';
import {Button, Divider, Text, TextInput, IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from 'react-native-wheel-pick';
import BlurSurface from '../BlurSurface';

import {toggleViewingPhoto} from '../../redux/chipSubmitterSlice';
import {submitChip} from '../../utils/postUtils';
import {selectUid, selectUserGoals} from '../../redux/authSlice';
import {Goal} from '../../types';
import {styles} from '../../styles';

function HabitPopup({
  userGoals,
  chipDesc,
  setChipDesc,
  closePopup,
  setSelectedGoalId,
  chipAmount,
  setChipAmount,
}) {
  const transparentBackgroundColor = 'rgba(223, 246, 255, 0.171)';

  return (
    <BlurSurface blurType="light" style={styles.widthAlmostFull}>
      <View style={styles.centered}>
        <Text variant="titleLarge">Edit habit info</Text>
      </View>
      <Divider style={styles.dividerMedium} />
      <View
        pointerEvents={'box-none'}
        style={{alignItems: 'center', height: 175}}>
        <Picker
          pointerEvents={'box-none'}
          style={{
            backgroundColor: transparentBackgroundColor,
            width: Dimensions.get('screen').width * 0.9 - 30,
            height: 175,
            borderRadius: 5,
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          itemStyle={{
            fontFamily: 'Lato-Medium',
          }}
          selectedValue={'Exercise'}
          pickerData={userGoals.map(g => ({
            value: g.id,
            label: g.name,
          }))}
          onValueChange={value => {
            setSelectedGoalId(value);
          }}
        />
      </View>
      <Divider style={styles.dividerSmall} />
      <View
        style={{
          backgroundColor: transparentBackgroundColor,
          padding: 10,
          marginTop: 7,
          paddingLeft: 15,
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text variant="bodyLarge">{chipAmount} minutes spent</Text>
        <View style={styles.rowCentered}>
          <Pressable
            onPress={() => setChipAmount(chipAmount - 1)}
            onLongPress={() => setChipAmount(chipAmount - 1)}
            style={localStyles.amtIcon}>
            <Icon name="chevron-back-outline" size={30} />
          </Pressable>
          <Pressable
            onPress={() => setChipAmount(chipAmount + 1)}
            onLongPress={() => setChipAmount(chipAmount + 1)}
            style={localStyles.amtIcon}>
            <Icon name="chevron-forward-outline" size={30} />
          </Pressable>
        </View>
      </View>
      <Divider style={styles.dividerSmall} />
      <TextInput
        style={{
          marginTop: 0,
          backgroundColor: transparentBackgroundColor,
        }}
        mode="outlined"
        label="Notes"
        value={chipDesc}
        onChangeText={text => setChipDesc(text)}
      />
      <Pressable
        onPress={closePopup}
        style={{
          width: 40,
          height: 40,

          position: 'absolute',
          top: 10,
          right: 10,

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon name="close-outline" size={30} />
      </Pressable>
    </BlurSurface>
  );
}

function PhotoViewer({photoSource}) {
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const uid = useSelector(selectUid);

  const userGoals: Goal[] = useSelector(selectUserGoals);

  const [popupShowing, setPopupShowing] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState(userGoals[0].id);

  const [chipDescription, setChipDescription] = useState('');
  const [chipAmount, setChipAmount] = useState(1);

  return (
    <View style={styles.absoluteFullCentered}>
      {popupShowing ? (
        <HabitPopup
          userGoals={userGoals}
          chipDesc={chipDescription}
          setChipDesc={setChipDescription}
          closePopup={() => setPopupShowing(!popupShowing)}
          setSelectedGoalId={setSelectedGoalId}
          chipAmount={chipAmount}
          setChipAmount={setChipAmount}
        />
      ) : (
        <></>
      )}
      <Pressable
        onPress={() => dispatch(toggleViewingPhoto())}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          height: 40,
          width: 40,
          borderRadius: 100,

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          position: 'absolute',
          left: 20,
          top: 20 + insets.top,
        }}>
        <Icon name="trash" size={24} color="white" style={{marginLeft: 2}} />
      </Pressable>
      {popupShowing ? (
        <></>
      ) : (
        <Button
          hitSlop={{
            bottom: 0,
            left: 20,
            right: 20,
            top: 0,
          }}
          icon="create-outline"
          mode="contained-tonal"
          onPress={() => setPopupShowing(true)}
          contentStyle={{flexDirection: 'row-reverse', alignItems: 'center'}}
          style={{
            position: 'absolute',
            left: 20,
            bottom: 30,
          }}>
          Habit details
        </Button>
      )}
      <Button
        icon="send-outline"
        mode="contained"
        onPress={() => {
          dispatch(toggleViewingPhoto());
          submitChip(photoSource, selectedGoalId, chipDescription, uid);
        }}
        contentStyle={{flexDirection: 'row-reverse', alignItems: 'center'}}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 30,
        }}>
        Save
      </Button>
    </View>
  );
}

export default PhotoViewer;

const localStyles = StyleSheet.create({
  amtIcon: {
    width: 36,
    height: 36,

    paddingTop: 1,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 10,

    borderRadius: 20,
  },
});
