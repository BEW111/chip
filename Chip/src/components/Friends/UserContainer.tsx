import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useAppSelector} from '../../redux/hooks';
import {styles, modalStyles} from '../../styles';

// Components
import {
  Button,
  Divider,
  Text,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  Surface,
  HelperText,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import InputFieldMenu from '../InputFieldMenu';
import AvatarDisplay from '../AvatarDisplay';

// stuff to delete
import {selectUid} from '../../redux/slices/authSlice';

// Friends
import {acceptInvite} from '../../supabase/friends';
import {useInviteUserMutation} from '../../redux/slices/friendsSlice';
import {SupabaseProfileWithFriendship} from '../../types/friends';
import {
  useAcceptCostreakMutation,
  useAddCostreakMutation,
  useGetFriendCostreaksQuery,
} from '../../redux/slices/costreaksSlice';
import {
  useGetFriendGoalsQuery,
  useGetGoalsQuery,
} from '../../redux/slices/goalsSlice';
import {
  useGetReceivedFriendRequestsQuery,
  useGetSentFriendRequestsQuery,
  useGetFriendsQuery,
} from '../../redux/slices/friendsSlice';

// Costreaks
import {
  SupabaseCostreakDetailed,
  SupabaseCostreakUpload,
} from '../../types/costreaks';

type UserContainerType = {
  user: SupabaseProfileWithFriendship;
};

type FriendModalType = {
  visible: boolean;
  hideModal: () => void;
  friend: SupabaseProfileWithFriendship;
};

type CostreakDisplayType = {
  costreak: SupabaseCostreakDetailed;
};

function CostreakDisplay({costreak}: CostreakDisplayType) {
  const uid = useAppSelector(selectUid);

  const [acceptCostreak] = useAcceptCostreakMutation();
  const onAcceptCostreak = () => {
    acceptCostreak(costreak.id);
  };

  if (!uid) {
    return <></>;
  }

  const [myGoal, theirGoal] =
    uid === costreak.sender_id
      ? [costreak.sender_goal_name, costreak.recipient_goal_name]
      : [costreak.recipient_goal_name, costreak.sender_goal_name];

  return (
    <Surface style={localStyles.costreakDisplaySurface}>
      <Text variant="labelLarge">
        You: {myGoal} {'\n'}
        Them: {theirGoal}
      </Text>
      {costreak.status === 'pending' && costreak.recipient_id === uid && (
        <Button
          mode="contained"
          labelStyle={localStyles.userButtonLabel}
          onPress={onAcceptCostreak}>
          Accept
        </Button>
      )}
    </Surface>
  );
}

function FriendModal({visible, hideModal, friend}: FriendModalType) {
  const uid = useAppSelector(selectUid);

  // Get goals
  const {data: myGoals} = useGetGoalsQuery();
  const {data: friendGoals} = useGetFriendGoalsQuery(friend.id);

  // Get menu items
  type MenuItem = {
    title: string;
    value: string;
  };
  const myGoalMenuItems =
    myGoals &&
    myGoals.map(
      g =>
        ({
          title: g.name,
          value: g.id,
        } as MenuItem),
    );
  const friendGoalMenuItems =
    friendGoals &&
    friendGoals.map(
      g =>
        ({
          title: g.name,
          value: g.id,
        } as MenuItem),
    );

  // Current state
  const [tab, setTab] = useState('create');
  const [myGoalSelected, setMyGoalSelected] = useState<MenuItem | null>(
    myGoalMenuItems ? myGoalMenuItems[0] : null,
  );
  const [friendGoalSelected, setFriendGoalSelected] = useState<MenuItem | null>(
    friendGoalMenuItems ? friendGoalMenuItems[0] : null,
  );
  const [displayError, setDisplayError] = useState('');

  const onDismiss = () => {
    setMyGoalSelected(null);
    setFriendGoalSelected(null);
    setDisplayError('');
    hideModal();
  };

  // Costreaks
  const [addCostreak] = useAddCostreakMutation();
  const {data: costreaks} = useGetFriendCostreaksQuery(friend.id);

  // Submitting a costreak
  const onCreateCostreak = async () => {
    if (
      uid &&
      friend.friendship_id &&
      myGoalSelected?.value &&
      friendGoalSelected?.value
    ) {
      const costreak: SupabaseCostreakUpload = {
        sender_id: uid,
        recipient_id: friend.id,
        friendship_id: friend.friendship_id,
        sender_goal_id: myGoalSelected.value,
        recipient_goal_id: friendGoalSelected.value,
      };
      await addCostreak(costreak);
    } else {
      setDisplayError('Please select a goal for both you and your friend.');
    }

    hideModal();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={modalStyles.container}>
      <View style={styles.row}>
        <AvatarDisplay height={48} width={48} url={friend.avatar_url} />
        <Divider style={styles.dividerHSmall} />
        <View>
          <Text variant="titleLarge">@{friend.username}</Text>
          <Text variant="titleSmall">{friend.full_name}</Text>
        </View>
      </View>
      <Divider style={styles.dividerSmall} />
      <View style={styles.row}>
        <Icon name="bonfire-outline" size={22} />
        <Divider style={styles.dividerHTiny} />
        <Text variant="titleLarge" style={{fontWeight: 'bold'}}>
          Costreaks
        </Text>
      </View>
      <Divider style={styles.dividerSmall} />
      <SegmentedButtons
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
      <Divider style={styles.dividerTiny} />
      {tab === 'create' ? (
        <>
          {myGoalMenuItems && (
            <InputFieldMenu
              label={'Your goal'}
              items={myGoalMenuItems}
              textInputStyle={modalStyles.textInput}
              onSelectedChange={(item: MenuItem) => setMyGoalSelected(item)}
            />
          )}
          <Divider style={styles.dividerSmall} />
          {friendGoalMenuItems && (
            <InputFieldMenu
              label={'@' + friend.username + "'s goal"}
              items={friendGoalMenuItems}
              textInputStyle={modalStyles.textInput}
              onSelectedChange={(item: MenuItem) => setFriendGoalSelected(item)}
            />
          )}
          <HelperText type="error" visible={displayError !== ''}>
            {displayError}
          </HelperText>
          <Divider style={styles.dividerSmall} />
          <Button mode="contained" onPress={onCreateCostreak}>
            Create
          </Button>
        </>
      ) : (
        costreaks && (
          <>
            <Text variant="titleMedium">Active</Text>
            <Divider style={styles.dividerSmall} />
            {costreaks
              .filter(costreak => costreak.status === 'accepted')
              .map(costreak => (
                <CostreakDisplay key={costreak.id} costreak={costreak} />
              ))}
            <Text variant="titleMedium">Received requests</Text>
            <Divider style={styles.dividerSmall} />
            {costreaks
              .filter(
                costreak =>
                  costreak.status === 'pending' &&
                  costreak.recipient_id === uid,
              )
              .map(costreak => (
                <CostreakDisplay key={costreak.id} costreak={costreak} />
              ))}
            <Text variant="titleMedium">Sent requests</Text>
            <Divider style={styles.dividerSmall} />
            {costreaks
              .filter(
                costreak =>
                  costreak.status === 'pending' && costreak.sender_id === uid,
              )
              .map(costreak => (
                <CostreakDisplay key={costreak.id} costreak={costreak} />
              ))}
          </>
        )
      )}
    </Modal>
  );
}

function UserContainer({user}: UserContainerType) {
  const currentUid = useAppSelector(selectUid);
  const isSelf = currentUid === user.id;

  // Popup modal
  const [pressed, setPressed] = useState(false);
  const [superstreakModalVisible, setSuperstreakModalVisible] = useState(false);
  const onChallenge = () => {
    setSuperstreakModalVisible(true);
  };

  // Pressing the whole container
  const onPressContainer = () => {
    setPressed(true);
    if (user.status === 'accepted') {
      setSuperstreakModalVisible(true);
    }
  };

  // Invites
  const {refetch: receivedRefetch} = useGetReceivedFriendRequestsQuery();
  const {refetch: sentRefetch} = useGetSentFriendRequestsQuery();
  const {refetch: friendsRefetch} = useGetFriendsQuery();
  const [inviteUser] = useInviteUserMutation();

  async function onSendInvite() {
    if (currentUid) {
      await inviteUser({
        sender_id: currentUid,
        recipient_id: user.id,
      });
      sentRefetch();
    }
  }
  async function onAcceptInvite() {
    if (currentUid) {
      await acceptInvite(user.id, currentUid);
      receivedRefetch();
      friendsRefetch();
    }
  }

  return (
    <>
      <Portal>
        <FriendModal
          visible={superstreakModalVisible}
          hideModal={() => setSuperstreakModalVisible(false)}
          friend={user}
        />
      </Portal>
      <Pressable
        onPressIn={onPressContainer}
        onPressOut={() => setPressed(false)}
        style={buttonStyles(pressed).button}>
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <AvatarDisplay height={48} width={48} url={user.avatar_url} />
            <Divider style={styles.dividerHSmall} />
            <View>
              <Text variant="titleMedium" style={localStyles.whiteText}>
                @{user.username}
              </Text>
              <Text variant="bodySmall" style={localStyles.grayText}>
                {user.full_name}
              </Text>
            </View>
          </View>
          {!isSelf &&
            (user.status === 'accepted' ? (
              <IconButton
                onPress={onChallenge}
                iconColor="white"
                icon="ellipsis-horizontal-outline"
                size={24}
              />
            ) : user.status === 'received' ? (
              <Button
                mode="contained"
                onPress={onAcceptInvite}
                labelStyle={localStyles.userButtonLabel}>
                Add back
              </Button>
            ) : user.status === 'sent' ? (
              <Button mode="text" labelStyle={localStyles.userButtonLabel}>
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
      </Pressable>
    </>
  );
}

export default UserContainer;

const buttonStyles = (pressed: boolean) =>
  StyleSheet.create({
    button: {
      backgroundColor: pressed ? '#4444' : '#0000',
      padding: 10,
      borderRadius: 10,
    },
  });

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
  whiteText: {color: 'white'},
  grayText: {color: 'gray'},
  costreakDisplaySurface: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});
