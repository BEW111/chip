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
  useTheme,
  TextInput,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import InputFieldMenu from '../InputFieldMenu';
import AvatarDisplay from '../AvatarDisplay';
import Tooltip from '../common/Tooltip';
import UserModal from './UserModal';

// Friends
import {selectUid} from '../../redux/slices/authSlice';
import {acceptInvite} from '../../supabase/friends';
import {useInviteUserMutation} from '../../redux/slices/friendsSlice';
import {SupabaseProfileWithFriendship} from '../../types/friends';
import {
  useAcceptCostreakMutation,
  useAddCostreakMutation,
  useDeleteCostreakMutation,
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
  useDeleteFriendshipMutation,
} from '../../redux/slices/friendsSlice';

// Costreaks
import {
  SupabaseCostreakDetailed,
  SupabaseCostreakUpload,
} from '../../types/costreaks';

type UserContainerType = {
  user: SupabaseProfileWithFriendship;
};

type CostreakModalType = {
  visible: boolean;
  hideModal: () => void;
  friend: SupabaseProfileWithFriendship;
};

type CostreakDisplayType = {
  costreak: SupabaseCostreakDetailed;
};

// Mini costreak display
function CostreakDisplay({costreak}: CostreakDisplayType) {
  const uid = useAppSelector(selectUid);

  // Accepting a costreak
  const [acceptCostreak] = useAcceptCostreakMutation();
  const onAcceptCostreak = () => {
    acceptCostreak(costreak.id);
  };

  // Deleting a costreak
  const [warnDeletingCostreak, setWarnDeletingCostreak] = useState(false);
  const [deleteCostreak] = useDeleteCostreakMutation();
  const onDeleteCostreak = async () => {
    if (warnDeletingCostreak) {
      await deleteCostreak(costreak.id);
    } else {
      setWarnDeletingCostreak(true);
    }
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
      {costreak.status === 'accepted' ? (
        <Button
          mode={warnDeletingCostreak ? 'contained' : 'outlined'}
          labelStyle={localStyles.userButtonLabel}
          onPress={onDeleteCostreak}>
          {warnDeletingCostreak ? 'Are you sure?' : 'Delete'}
        </Button>
      ) : (
        costreak.status === 'pending' &&
        costreak.recipient_id === uid && (
          <Button
            mode="contained"
            labelStyle={localStyles.userButtonLabel}
            onPress={onAcceptCostreak}>
            Accept
          </Button>
        )
      )}
    </Surface>
  );
}

function CostreakModal({visible, hideModal, friend}: CostreakModalType) {
  const uid = useAppSelector(selectUid);
  const theme = useTheme();

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
    myGoals
      .filter(g => g.is_public)
      .map(
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
  const [costreakTab, setCostreakTab] = useState('manage');
  const [myGoalSelected, setMyGoalSelected] = useState<MenuItem | null>(
    myGoalMenuItems ? myGoalMenuItems[0] : null,
  );
  const [friendGoalSelected, setFriendGoalSelected] = useState<MenuItem | null>(
    friendGoalMenuItems ? friendGoalMenuItems[0] : null,
  );
  const [displayError, setDisplayError] = useState('');

  // Modal dismissing
  const onDismiss = () => {
    setCostreakTab('manage');
    setCostreakTooltipVisible(false);
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
      const {error} = await addCostreak(costreak);
      if (error && error.message === 'Costreak pairing already exists') {
        setDisplayError('You already have a superstreak with these goals');
        return;
      }
      setCostreakTab('manage');
    } else {
      setDisplayError('Please select a goal for both you and your friend.');
    }
  };

  // Costreak tooltip
  const [costreakTooltipVisible, setCostreakTooltipVisible] = useState(false);

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={modalStyles.container}>
      <Pressable onPress={() => setCostreakTooltipVisible(false)}>
        <View style={styles.row}>
          <AvatarDisplay height={48} width={48} url={friend.avatar_url} />
          <Divider style={styles.dividerHSmall} />
          <View>
            <Text variant="titleLarge">@{friend.username}</Text>
            {friend.full_name && (
              <Text variant="titleSmall">{friend.full_name}</Text>
            )}
          </View>
        </View>
        <Divider style={styles.dividerSmall} />
        <View style={styles.row}>
          <Icon name="bonfire-outline" size={22} />
          <Divider style={styles.dividerHTiny} />
          <Tooltip
            visible={costreakTooltipVisible}
            text={
              <Text
                variant="labelLarge"
                style={{color: theme && theme.colors.onTertiary}}>
                <Text
                  variant="labelLarge"
                  style={{
                    color: theme && theme.colors.secondaryContainer,
                    fontWeight: 'bold',
                  }}>
                  Superstreaks
                </Text>{' '}
                {
                  'are special streaks you can\nshare with a friend. To start a superstreak,\npropose a personal goal that each of you\nwill work on. If either of you breaks your\npersonal streak, then the whole superstreak\nwill reset!'
                }
              </Text>
            }>
            <Text variant="titleLarge" style={{fontWeight: 'bold'}}>
              Superstreaks
            </Text>
          </Tooltip>
          <Pressable onPress={() => setCostreakTooltipVisible(true)}>
            <Icon name="help-circle-outline" size={22} />
          </Pressable>
        </View>
        <Divider style={styles.dividerSmall} />
        <SegmentedButtons
          value={costreakTab}
          onValueChange={setCostreakTab}
          buttons={[
            {
              value: 'manage',
              label: 'Manage',
            },
            {
              value: 'create',
              label: 'Create',
            },
          ]}
        />
        <Divider style={styles.dividerTiny} />
        {costreakTab === 'create' ? (
          <>
            {myGoalMenuItems && myGoalMenuItems.length > 0 ? (
              <InputFieldMenu
                label={'Your goal'}
                items={myGoalMenuItems}
                textInputStyle={modalStyles.textInput}
                onSelectedChange={(item: MenuItem) => setMyGoalSelected(item)}
              />
            ) : (
              <TextInput
                mode="outlined"
                style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
                label={'Create a public goal first'}
                disabled={true}
              />
            )}
            <Divider style={styles.dividerSmall} />
            {friendGoalMenuItems && friendGoalMenuItems.length > 0 ? (
              <InputFieldMenu
                label={'@' + friend.username + "'s goal"}
                items={friendGoalMenuItems}
                textInputStyle={modalStyles.textInput}
                onSelectedChange={(item: MenuItem) =>
                  setFriendGoalSelected(item)
                }
              />
            ) : (
              <TextInput
                mode="outlined"
                style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
                label={'@' + friend.username + " doesn't have any public goals"}
                disabled={true}
              />
            )}
            <HelperText type="error" visible={displayError !== ''}>
              {displayError}
            </HelperText>
            <Divider style={styles.dividerSmall} />
            <Button
              mode="contained"
              onPress={onCreateCostreak}
              disabled={
                !myGoalMenuItems ||
                myGoalMenuItems.length === 0 ||
                !friendGoalMenuItems ||
                friendGoalMenuItems.length === 0
              }>
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
      </Pressable>
    </Modal>
  );
}

function UserContainer({user}: UserContainerType) {
  const currentUid = useAppSelector(selectUid);
  const isSelf = currentUid === user.id;

  // Container style
  const [pressed, setPressed] = useState(false);

  // Popup modals
  const [costreakModalVisible, setCostreakModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const onOpenMainModal = () => {
    if (!isSelf) {
      setUserModalVisible(true);
    }
  };
  const onOpenCostreakModal = () => {
    if (user.status === 'accepted') {
      setCostreakModalVisible(true);
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
        <CostreakModal
          visible={costreakModalVisible}
          hideModal={() => setCostreakModalVisible(false)}
          friend={user}
        />
        <UserModal
          visible={userModalVisible}
          hideModal={() => setUserModalVisible(false)}
          user={user}
        />
      </Portal>
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onOpenMainModal}>
        <View style={buttonStyles(pressed).button}>
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
                <View style={{flexDirection: 'row'}}>
                  <IconButton
                    onPress={onOpenCostreakModal}
                    iconColor="white"
                    icon="bonfire-outline"
                    size={24}
                  />
                  <IconButton
                    onPress={onOpenMainModal}
                    iconColor="white"
                    icon="ellipsis-horizontal-outline"
                    size={24}
                  />
                </View>
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
              ) : user.status === 'blocked' ? (
                <Button mode="text" labelStyle={localStyles.userButtonLabel}>
                  Blocked
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
