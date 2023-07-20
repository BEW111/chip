import React, {useState} from 'react';
import {Keyboard, View, Pressable, Dimensions, StyleSheet} from 'react-native';
import {Button, Divider, Text, TextInput} from 'react-native-paper';
import {useAppSelector, useAppDispatch} from '../../redux/hooks';
import {styles} from '../../styles';

// Misc
import pluralize from 'pluralize';

// Components
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from 'react-native-wheel-pick';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BlurSurface from '../BlurSurface';

// Camera state
import {
  selectPhotoPath,
  selectViewingPhoto,
  viewingPhotoStop,
  testReducer,
} from '../../redux/slices/cameraSlice';

// State and supabase
import {selectUid} from '../../redux/slices/authSlice';
import {chipSubmissionStart} from '../../redux/slices/chipSubmitterSlice';
import {useGetGoalsQuery} from '../../redux/supabaseApi';
import {ChipSubmission} from '../../types/chips';

// TODO: move this to another file
const transparentBackgroundColor = 'rgba(223, 246, 255, 0.171)';

type HabitPopupProps = {
  chipDesc: string;
  setChipDesc: React.Dispatch<React.SetStateAction<string>>;
  closePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGoalId: React.Dispatch<React.SetStateAction<number>>;
  chipAmount: number;
  setChipAmount: React.Dispatch<React.SetStateAction<number>>;
};

function HabitPopup({
  chipDesc,
  setChipDesc,
  closePopup,
  setSelectedGoalId,
  chipAmount,
  setChipAmount,
}: HabitPopupProps) {
  // Function to get all the goal data by a certain goal id
  const {data: userGoals, isFetching} = useGetGoalsQuery([]);
  const getGoalFromId = (id: number, goals: Goal[]) =>
    goals.filter((g: Goal) => g.id === id)[0];
  console.log(userGoals);

  // Id of current goal selected
  const [currentId, setCurrentId] = useState(-1);

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <BlurSurface blurType="light" style={styles.widthAlmostFull}>
        <View style={styles.centered}>
          <Text variant="titleLarge">Edit chip info</Text>
        </View>
        <Divider style={styles.dividerMedium} />
        <View
          pointerEvents={'box-none'}
          style={{alignItems: 'center', height: 175}}>
          {userGoals && (
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
              pickerData={userGoals.map((g: Goal) => ({
                value: g.id,
                label: g.emoji + ' ' + g.name,
              }))}
              onValueChange={(id: number) => {
                setSelectedGoalId(id);
                setCurrentId(id);
              }}
            />
          )}
        </View>
        <Divider style={styles.dividerSmall} />
        <TextInput
          style={{
            marginTop: 0,
            backgroundColor: transparentBackgroundColor,
          }}
          contentStyle={{
            color: 'black',
          }}
          outlineStyle={{
            borderColor: '#AAF0',
            borderWidth: 0,
            color: 'black',
          }}
          mode="outlined"
          keyboardType="decimal-pad"
          value={chipAmount.toString()}
          onChangeText={text => {
            setChipAmount(text);
          }}
          right={
            <TextInput.Affix
              text={
                userGoals && currentId >= 0
                  ? pluralize(
                      getGoalFromId(currentId, userGoals).units || 'units',
                      parseFloat(chipAmount),
                    )
                  : ''
              }
            />
          }
        />
        <Divider style={styles.dividerSmall} />
        <TextInput
          style={{
            marginTop: 0,
            backgroundColor: transparentBackgroundColor,
          }}
          contentStyle={{
            color: 'black',
          }}
          outlineStyle={{
            borderColor: '#AAF0',
            borderWidth: 0,
            color: 'black',
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
    </Pressable>
  );
}

function PhotoViewer() {
  const insets = useSafeAreaInsets();

  const dispatch = useAppDispatch();
  const uid = useAppSelector(selectUid);
  const photoPath = useAppSelector(selectPhotoPath);

  // Current popup state
  const [popupShowing, setPopupShowing] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState(0);
  const [chipDescription, setChipDescription] = useState('');
  const [chipAmount, setChipAmount] = useState<string>('1');

  const viewingPhoto = useAppSelector(selectViewingPhoto);

  // When this is called, we'll actually submit the chip
  const onSubmitChip = () => {
    console.log('[onSubmitChip]');
    dispatch(viewingPhotoStop());

    if (uid && photoPath) {
      const chipSubmission: ChipSubmission = {
        goalId: selectedGoalId,
        photoUri: photoPath,
        description: chipDescription,
        amount: parseFloat(chipAmount),
        uid,
      };

      dispatch(chipSubmissionStart(chipSubmission));
    }
  };

  // When this is called, we'll discard the current photo
  const onDeleteChip = () => {
    dispatch(viewingPhotoStop());
  };

  return (
    <View style={styles.absoluteFullCentered}>
      {popupShowing && (
        <HabitPopup
          chipDesc={chipDescription}
          setChipDesc={setChipDescription}
          closePopup={() => setPopupShowing(!popupShowing)}
          setSelectedGoalId={setSelectedGoalId}
          chipAmount={chipAmount}
          setChipAmount={setChipAmount}
        />
      )}
      <Pressable
        onPress={onDeleteChip}
        style={localStyles(insets.top).trashButtonContainer}>
        <Icon
          name="trash"
          size={24}
          color="white"
          style={localStyles().iconShifted}
        />
      </Pressable>
      {!popupShowing && (
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
          contentStyle={localStyles().buttonContent}
          style={localStyles().detailsButton}>
          Chip details
        </Button>
      )}
      <Button
        icon="send-outline"
        mode="contained"
        onPress={onSubmitChip}
        contentStyle={localStyles().buttonContent}
        style={localStyles(insets.top).saveButton}>
        Save
      </Button>
    </View>
  );
}

export default PhotoViewer;

const localStyles = (insetsTop?: number) =>
  StyleSheet.create({
    iconShifted: {marginLeft: 2},
    detailsButton: {
      position: 'absolute',
      left: 20,
      bottom: 30,
    },
    buttonContent: {flexDirection: 'row-reverse', alignItems: 'center'},
    trashButtonContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      height: 40,
      width: 40,
      borderRadius: 100,

      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      position: 'absolute',
      left: 20,
      top: 20 + (insetsTop !== undefined ? insetsTop : 0),
    },
    saveButton: {
      position: 'absolute',
      right: 20,
      bottom: 30,
    },
  });
