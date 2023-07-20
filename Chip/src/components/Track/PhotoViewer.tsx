import React, {useState, useEffect} from 'react';
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
  viewingPhotoStop,
} from '../../redux/slices/cameraSlice';

// State and supabase
import {selectUid} from '../../redux/slices/authSlice';
import {chipSubmissionStart} from '../../redux/slices/chipSubmitterSlice';
import {useGetGoalsQuery} from '../../redux/supabaseApi';
import {ChipSubmission} from '../../types/chips';
import {SupabaseGoal} from '../../types/goals';

type HabitPopupProps = {
  chipDesc: string;
  setChipDesc: React.Dispatch<React.SetStateAction<string>>;
  closePopup: () => void;
  setSelectedGoalId: React.Dispatch<React.SetStateAction<number>>;
  chipAmount: string;
  setChipAmount: React.Dispatch<React.SetStateAction<string>>;
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
  const {data: userGoals, isFetching} = useGetGoalsQuery();
  const getGoalFromId = (id: number, goals: SupabaseGoal[]) =>
    goals.filter(g => g.id === id)[0];

  // Id of current goal selected
  const startingId = userGoals ? userGoals[0].id : -1;
  const [currentId, setCurrentId] = useState(startingId || -1);

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <BlurSurface blurType="light" style={styles.widthAlmostFull}>
        <View style={styles.centered}>
          <Text variant="titleLarge">Edit chip info</Text>
        </View>
        <Divider style={styles.dividerMedium} />
        {isFetching ? (
          <View style={popupStyles.tempView} />
        ) : (
          <View pointerEvents={'box-none'} style={popupStyles.wrapper}>
            {userGoals && (
              <Picker
                pointerEvents={'box-none'}
                style={popupStyles.picker}
                itemStyle={popupStyles.pickerItem}
                selectedValue={'Exercise'}
                pickerData={userGoals.map((g: SupabaseGoal) => ({
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
        )}
        <Divider style={styles.dividerSmall} />
        <TextInput
          style={popupStyles.textInput}
          contentStyle={popupStyles.textInputContent}
          outlineStyle={popupStyles.textInputOutline}
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
                      getGoalFromId(currentId, userGoals).iteration_units ||
                        'units',
                      parseFloat(chipAmount),
                    )
                  : ''
              }
            />
          }
        />
        <Divider style={styles.dividerSmall} />
        <TextInput
          style={popupStyles.textInput}
          contentStyle={popupStyles.textInputContent}
          outlineStyle={popupStyles.textInputOutline}
          mode="outlined"
          label="Notes"
          value={chipDesc}
          onChangeText={text => setChipDesc(text)}
        />
        <Pressable onPress={closePopup} style={popupStyles.closeButton}>
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
  const [selectedGoalId, setSelectedGoalId] = useState(-1);
  const [chipDescription, setChipDescription] = useState('');
  const [chipAmount, setChipAmount] = useState<string>('1');

  const {data: userGoals} = useGetGoalsQuery();

  // When this is called, we'll actually submit the chip
  const onSubmitChip = () => {
    console.log('[onSubmitChip]');
    dispatch(viewingPhotoStop());

    let goalId = selectedGoalId;

    // TODO: I'd like to find a cleaner solution, but sometimes
    if (selectedGoalId === -1) {
      if (userGoals && userGoals.length > 0 && userGoals[0].id) {
        goalId = userGoals[0].id;
      } else {
        console.log('Invalid selected goal ID');
        return;
      }
    }

    if (uid && photoPath) {
      const chipSubmission: ChipSubmission = {
        goalId: goalId,
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

// TODO: move these to another file
const transparentBackgroundColor = 'rgba(223, 246, 255, 0.171)';
const screenWidth = Dimensions.get('screen').width;

const popupStyles = StyleSheet.create({
  wrapper: {alignItems: 'center', height: 175},
  picker: {
    backgroundColor: transparentBackgroundColor,
    width: screenWidth * 0.9 - 30,
    height: 175,
    borderRadius: 5,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerItem: {
    fontFamily: 'Lato-Medium',
  },
  textInput: {
    marginTop: 0,
    backgroundColor: transparentBackgroundColor,
  },
  textInputContent: {
    color: 'black',
  },
  textInputOutline: {
    borderColor: '#0000',
    borderWidth: 0,
    color: 'black',
  },
  closeButton: {
    width: 40,
    height: 40,

    position: 'absolute',
    top: 10,
    right: 10,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempView: {
    backgroundColor: transparentBackgroundColor,
    width: screenWidth * 0.9 - 30,
    height: 175,
    borderRadius: 5,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

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
