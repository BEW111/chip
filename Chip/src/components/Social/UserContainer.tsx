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
import {useSelector, useDispatch} from 'react-redux';

import profileDefault from '../../../assets/profile-default.png';

import {selectUid, selectUserGoals} from '../../redux/authSlice';
import {inviteUser, acceptInvite} from '../../firebase/users';

import {styles, modalStyles} from '../../styles';
import {getGoalsPublic} from '../../firebase/goals';

import InputFieldMenu from '../InputFieldMenu';
import {$CombinedState} from '@reduxjs/toolkit';

interface UserContainerType {
  user: string;
  isFriend?: boolean;
  isAccepted?: boolean;
  isInvited?: boolean;
  isReceived?: boolean;
}

const items = [
  {
    title: 'Item 1',
    value: 1,
  },
  {
    title: 'Item 2',
    value: 2,
  },
  {
    title: 'Item 3',
    value: 3,
  },
];

function ChallengeUserModal({visible, hideModal, user}) {
  const thisUserGoals = useSelector(selectUserGoals);
  const thisUserMenuItems = thisUserGoals.map(g => ({
    title: g.name,
    value: g.id,
  }));
  const [otherUserGoals, setOtherUserGoals] = useState([]);
  const [otherUserMenuItems, setOtherUserMenuItems] = useState([]);
  const [thisUserSelected, setThisUserSelected] = useState({});
  const [otherUserSelected, setOtherUserSelected] = useState({});

  async function updateOtherUserGoals() {
    if (visible) {
      const g = await getGoalsPublic(user.id);
      setOtherUserGoals(g);
    }
  }

  useEffect(() => {
    updateOtherUserGoals();
    if (otherUserGoals.length > 0) {
      setOtherUserMenuItems(
        otherUserGoals.map(g => ({
          title: g.name,
          value: g.id,
        })),
      );
    }
  }, [user.id, visible]);

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={modalStyles.container}>
      <Text variant="titleLarge" style={styles.textCentered}>
        Start a superstreak with @{user.username}
      </Text>
      <Divider style={styles.dividerSmall} />
      <Text variant="labelLarge">Your goal</Text>
      <Divider style={styles.dividerTiny} />
      <InputFieldMenu
        items={thisUserMenuItems}
        onSelectedChange={item => setThisUserSelected(item)}
      />
      <Divider style={styles.dividerMedium} />
      <Text variant="labelLarge">@{user.username}'s goal</Text>
      <Divider style={styles.dividerTiny} />
      <InputFieldMenu
        items={otherUserMenuItems}
        onSelectedChange={item => setOtherUserSelected(item)}
      />
    </Modal>
  );
}

function UserContainer(props: UserContainerType) {
  const {user, isFriend, isAccepted, isInvited, isReceived} = props;

  const [pressed, setPressed] = useState(false);
  const [superstreakModalVisible, setSuperstreakModalVisible] = useState(false);

  const currentUserUid = useSelector(selectUid);
  const dispatch = useDispatch();

  const isSelf = currentUserUid === user.id;

  async function onSendInvite() {
    console.log('onSendInvite');
    const result = await inviteUser(currentUserUid, user.id, dispatch);
  }

  async function onAcceptInvite() {
    console.log('onAcceptInvite');
    const result = await acceptInvite(user.id, currentUserUid, dispatch);
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
            <FastImage
              source={profileDefault}
              style={{width: 48, height: 48}}
            />
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
});
