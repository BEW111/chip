import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Button,
  Divider,
  Text,
  IconButton,
  Modal,
  Portal,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import profileDefault from '../../../assets/profile-default.png';

import {selectUid, selectUserGoals} from '../../redux/authSlice';
import {inviteUser, acceptInvite} from '../../firebase/friends';

import {styles, modalStyles} from '../../styles';
import {getGoalsPublic} from '../../firebase/goals';
import {createSuperstreak} from '../../firebase/superstreaks';

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
  const currentUserUid = useSelector(selectUid);
  const thisUserGoals = useSelector(selectUserGoals);
  const thisUserMenuItems = thisUserGoals.map(g => ({
    title: g.name,
    value: g.id,
  }));
  // const [otherUserGoals, setOtherUserGoals] = useState([]);
  const [otherUserMenuItems, setOtherUserMenuItems] = useState([]);
  const [thisUserSelected, setThisUserSelected] = useState({});
  const [otherUserSelected, setOtherUserSelected] = useState({});

  function onDismiss() {
    setThisUserSelected({});
    setOtherUserSelected({});
    hideModal();
  }

  async function updateOtherUserGoals() {
    if (visible) {
      const otherUserGoals = await getGoalsPublic(user.uid);
      if (otherUserGoals.length > 0) {
        setOtherUserMenuItems(
          otherUserGoals.map(g => ({
            title: g.name,
            value: g.id,
          })),
        );
      }
    }
  }

  async function onRequestSuperstreak() {
    // const thisGoal = g
    createSuperstreak(
      currentUserUid,
      user.uid,
      thisUserSelected.value,
      otherUserSelected.value,
      'daily',
    );
  }

  useEffect(() => {
    updateOtherUserGoals();
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
        <Icon name="bonfire-outline" size={18} />
        <Divider style={styles.dividerHTiny} />
        <Text variant="titleMedium" style={{fontWeight: 'bold'}}>
          Manage superstreaks
        </Text>
      </View>
      <Divider style={styles.dividerTiny} />
      {/* <Text variant="bodyLarge">
        Pick a goal for you and @{user.username} to keep a streak on together.
        If either of you breaks your goal, then the superstreak restarts.
      </Text> */}
      <Divider style={styles.dividerTiny} />
      <InputFieldMenu
        label={'Your goal'}
        items={thisUserMenuItems}
        textInputStyle={modalStyles.textInput}
        onSelectedChange={item => setThisUserSelected(item)}
      />
      <Divider style={styles.dividerSmall} />
      <InputFieldMenu
        label={'@' + user.username + "'s goal"}
        items={otherUserMenuItems}
        textInputStyle={modalStyles.textInput}
        onSelectedChange={item => setOtherUserSelected(item)}
      />
      <Divider style={styles.dividerSmall} />
      <Button mode="contained" onPress={onRequestSuperstreak}>
        Create
      </Button>
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
    // console.log(result);
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
