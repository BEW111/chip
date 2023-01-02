import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Button,
  Divider,
  Text,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  useTheme,
  HelperText,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import {selectUid, selectUserGoals} from '../../redux/authSlice';
import {inviteUser, acceptInvite} from '../../firebase/friends';

import {styles, modalStyles} from '../../styles';
import {getGoalsPublic} from '../../firebase/goals';
import {
  createSuperstreak,
  getSuperstreaksByUser,
} from '../../firebase/superstreaks';

import {PublicUser} from '../../types';

import InputFieldMenu from '../InputFieldMenu';
import ProfileImageDisplay from '../ProfileImageDisplay';

interface UserContainerType {
  user: PublicUser;
  isFriend?: boolean;
  isAccepted?: boolean;
  isInvited?: boolean;
  isReceived?: boolean;
}

function ChallengeUserModal({visible, hideModal, user}) {
  const theme = useTheme();

  const currentUserUid = useSelector(selectUid);
  const thisUserGoals = useSelector(selectUserGoals);
  const thisUserMenuItems = thisUserGoals.map(g => ({
    title: g.name,
    value: g.id,
  }));
  const [otherUserMenuItems, setOtherUserMenuItems] = useState([]);
  const [thisUserSelected, setThisUserSelected] = useState({});
  const [otherUserSelected, setOtherUserSelected] = useState({});
  const [existingSuperstreaks, setExistingSuperstreaks] = useState([]);

  const [tab, setTab] = useState('create');

  const [displayError, setDisplayError] = useState('');

  function onDismiss() {
    setThisUserSelected({});
    setOtherUserSelected({});
    hideModal();
  }

  async function updateOtherUserInfo() {
    if (visible) {
      // update other user goals
      const otherUserGoals = await getGoalsPublic(user.uid);
      if (otherUserGoals.length > 0) {
        setOtherUserMenuItems(
          otherUserGoals.map(g => ({
            title: g.name,
            value: g.id,
          })),
        );
      }

      // update info for existing superstreaks
      let existing = await getSuperstreaksByUser(user.uid);
      existing = existing.filter(superstreak =>
        superstreak.users.includes(currentUserUid),
      );
      if (existing.length > 0) {
        setExistingSuperstreaks(
          existing.map(superstreak => ({
            goalData: superstreak.goals.map(goalId => {
              const filteredThis = thisUserGoals.filter(
                goal => goal.id === goalId,
              );
              const filteredOther = otherUserGoals.filter(
                goal => goal.id === goalId,
              );
              return filteredThis.length > 0
                ? filteredThis[0]
                : filteredOther[0];
            }),
            ...superstreak,
          })),
        );
      }
    }
  }

  async function onRequestSuperstreak() {
    if (!thisUserSelected.value || !otherUserSelected.value) {
      // Missing values
      return;
    }
    // const thisGoal = g
    const result = await createSuperstreak(
      currentUserUid,
      user.uid,
      thisUserSelected.value,
      otherUserSelected.value,
      'daily',
    );

    if (result?.status === 'error') {
      setDisplayError('This superstreak already exists');
      return;
    }

    setThisUserSelected({});
    setOtherUserSelected({});
    setTab('manage');
    setDisplayError('');
  }

  useEffect(() => {
    updateOtherUserInfo();
  }, [user.uid, visible]);

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={modalStyles.container}>
      <View style={styles.row}>
        <ProfileImageDisplay height={48} width={48} uid={user.uid} />
        <Divider style={styles.dividerHSmall} />
        <View>
          <Text variant="titleLarge">@{user.username}</Text>
          <Text variant="titleSmall">{user.email}</Text>
        </View>
      </View>
      <Divider style={styles.dividerSmall} />
      <View style={styles.row}>
        <Icon name="bonfire-outline" size={22} />
        <Divider style={styles.dividerHTiny} />
        <Text variant="titleLarge" style={{fontWeight: 'bold'}}>
          Superstreaks
        </Text>
      </View>
      <Divider style={styles.dividerSmall} />
      <SegmentedButtons
        style={modalStyles.segmentedButtons}
        value={tab}
        onValueChange={setTab}
        buttons={[
          {
            value: 'create',
            label: 'Create',
          },
          {
            value: 'manage',
            label: 'Manage',
          },
        ]}
      />
      {/* <Text variant="bodyLarge">
        Pick a goal for you and @{user.username} to keep a streak on together.
        If either of you breaks your goal, then the superstreak restarts.
      </Text> */}
      <Divider style={styles.dividerTiny} />
      {tab === 'create' ? (
        <>
          <InputFieldMenu
            label={'Your goal'}
            items={thisUserMenuItems}
            textInputStyle={modalStyles.textInput}
            onSelectedChange={item => setThisUserSelected(item)}
          />
          <Divider style={styles.dividerTiny} />
          <InputFieldMenu
            label={'@' + user.username + "'s goal"}
            items={otherUserMenuItems}
            textInputStyle={modalStyles.textInput}
            onSelectedChange={item => setOtherUserSelected(item)}
          />
          <HelperText type="error" visible={displayError !== ''}>
            {displayError}
          </HelperText>
          <Divider style={styles.dividerSmall} />
          <Button mode="contained" onPress={onRequestSuperstreak}>
            Create
          </Button>
        </>
      ) : (
        existingSuperstreaks.length > 0 &&
        existingSuperstreaks.map(superstreak => (
          <>
            <Divider style={styles.dividerTiny} />
            <View
              key={superstreak.goals.join('')}
              style={{
                padding: 8,
                paddingLeft: 12,
                backgroundColor: 'white',
                borderColor: theme.colors.outline,
                borderWidth: 1,
                borderRadius: 6,
              }}>
              <Text variant="bodyLarge">
                {superstreak.goalData.map(goal => goal.name).join(' & ')}
              </Text>
            </View>
          </>
        ))
      )}
    </Modal>
  );
}

function UserContainer(props: UserContainerType) {
  const {user, isFriend, isAccepted, isInvited, isReceived}: UserContainerType =
    props;

  const [pressed, setPressed] = useState(false);
  const [superstreakModalVisible, setSuperstreakModalVisible] = useState(false);

  const currentUserUid = useSelector(selectUid);
  const dispatch = useDispatch();

  const isSelf = currentUserUid === user.uid;

  async function onSendInvite() {
    console.log('[onSendInvite]');
    const result = await inviteUser(currentUserUid, user.uid, dispatch);
  }

  async function onAcceptInvite() {
    console.log('[onAcceptInvite]');
    const result = await acceptInvite(user.uid, currentUserUid, dispatch);
    console.log(result);
  }

  async function onChallenge() {
    setSuperstreakModalVisible(true);
  }

  return (
    <>
      <Portal>
        <ChallengeUserModal
          visible={superstreakModalVisible}
          hideModal={() => setSuperstreakModalVisible(false)}
          user={user}
        />
      </Portal>
      <View
        // onPressIn={() => setPressed(true)}
        // onPressOut={() => setPressed(false)}
        style={{
          backgroundColor: pressed ? '#DDD4' : '#0000',
          padding: 10,
          borderRadius: 10,
        }}>
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <ProfileImageDisplay height={48} width={48} uid={user.uid} />
            <Divider style={styles.dividerHSmall} />
            <View>
              <Text variant="titleMedium" style={{color: 'white'}}>
                @{user.username}
              </Text>
              <Text variant="bodySmall" style={{color: 'gray'}}>
                {user.email}
              </Text>
            </View>
          </View>
          {!isSelf &&
            (isFriend ? (
              <IconButton
                onPress={onChallenge}
                iconColor="white"
                icon="ellipsis-horizontal-outline"
                size={24}
              />
            ) : isAccepted ? (
              <Button
                disabled
                mode="contained"
                labelStyle={localStyles.userButtonLabel}>
                Added
              </Button>
            ) : isReceived ? (
              <Button
                mode="contained"
                onPress={onAcceptInvite}
                labelStyle={localStyles.userButtonLabel}>
                Add back
              </Button>
            ) : isInvited ? (
              <Button
                mode="contained"
                disabled
                labelStyle={localStyles.userButtonLabel}>
                Invite pending
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={onSendInvite}
                labelStyle={localStyles.userButtonLabel}>
                Add friend
              </Button>
            ))}
        </View>
      </View>
    </>
  );
}

export default UserContainer;

const localStyles = StyleSheet.create({
  userButtonLabel: {
    fontSize: 12,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  card: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: 'white',
  },
});
