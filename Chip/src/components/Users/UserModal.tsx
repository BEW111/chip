import React, {useState} from 'react';
import {View} from 'react-native';
import {useAppSelector} from '../../redux/hooks';
import {styles, modalStyles} from '../../styles';

// Components
import {Button, Divider, Text, Modal, HelperText} from 'react-native-paper';
import AvatarDisplay from '../AvatarDisplay';

// Types
import {SupabaseProfileWithFriendship} from '../../types/friends';

// User info/actions
import {selectUid} from '../../redux/slices/authSlice';
import {useDeleteFriendshipMutation} from '../../redux/slices/friendsSlice';
import {useBlockUserMutation} from '../../redux/slices/blocksSlice';

type UserModalType = {
  visible: boolean;
  hideModal: () => void;
  user: SupabaseProfileWithFriendship;
};

// Modal that is available for all users (manage friendship, block, report)
function UserModal({visible, hideModal, user}: UserModalType) {
  // Modal dismissing
  const onDismiss = () => {
    setWarnRemovingFriend(false);
    setWarnBlockingUser(false);
    hideModal();
  };

  // Friend removal
  const [removeFriend] = useDeleteFriendshipMutation();
  const [warnRemovingFriend, setWarnRemovingFriend] = useState(false);
  const onPressRemoveFriend = async () => {
    if (warnRemovingFriend && user.friendship_id) {
      await removeFriend(user.friendship_id);
      onDismiss();
    } else {
      setWarnRemovingFriend(true);
    }
  };

  // Blocking a user
  const currentUid = useAppSelector(selectUid);
  const [blockUser] = useBlockUserMutation();
  const [warnBlockingUser, setWarnBlockingUser] = useState(false);
  const onPressBlockUser = async () => {
    if (warnBlockingUser && currentUid) {
      await blockUser({
        sender_id: currentUid,
        recipient_id: user.id,
      });
      if (user.friendship_id) {
        await removeFriend(user.friendship_id);
      }
      onDismiss();
    } else {
      setWarnBlockingUser(true);
    }
  };

  // Reporting a user
  const [warnReportingUser, setWarnReportingUser] = useState(false);
  const onPressReportUser = async () => {
    if (warnReportingUser && currentUid) {
      await blockUser({
        sender_id: currentUid,
        recipient_id: user.id,
      });
      if (user.friendship_id) {
        await removeFriend(user.friendship_id);
      }
      onDismiss();
    } else {
      setWarnReportingUser(true);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={modalStyles.container}>
      <View style={styles.row}>
        <AvatarDisplay height={48} width={48} url={user.avatar_url} />
        <Divider style={styles.dividerHSmall} />
        <View>
          <Text variant="titleLarge">@{user.username}</Text>
          {user.full_name && <Text variant="titleSmall">{user.full_name}</Text>}
        </View>
      </View>
      <Divider style={styles.dividerSmall} />
      <View style={styles.row}>
        <Text variant="titleLarge" style={{fontWeight: 'bold'}}>
          Manage user
        </Text>
      </View>
      {user.status === 'accepted' && (
        <>
          <Divider style={styles.dividerSmall} />
          <Button
            mode={warnRemovingFriend ? 'contained' : 'outlined'}
            onPress={onPressRemoveFriend}>
            {warnRemovingFriend
              ? 'Confirm you want to remove this friend?'
              : 'Remove friend'}
          </Button>
        </>
      )}
      <Divider style={styles.dividerMedium} />
      <Button
        mode={warnBlockingUser ? 'contained' : 'outlined'}
        onPress={onPressBlockUser}>
        {warnBlockingUser
          ? 'Confirm you want to block this user?'
          : 'Block user'}
      </Button>
      <Divider style={styles.dividerTiny} />
      <HelperText type="info">
        By blocking this user, you will no longer be able to see their posts,
        stories, goals, or friendship requests. They will not know you have
        blocked them.
        {user.status === 'accepted' &&
          ' This will also automatically remove the user as a friend.'}
      </HelperText>
      <Divider style={styles.dividerMedium} />
      <Button
        mode={warnReportingUser ? 'contained' : 'outlined'}
        onPress={onPressReportUser}>
        {warnReportingUser
          ? 'Confirm you want to block and report this user?'
          : 'Block and report user'}
      </Button>
      <Divider style={styles.dividerTiny} />
      <HelperText type="info">
        This will block the user and report them for harassment or inappropriate
        behavior.
      </HelperText>
    </Modal>
  );
}

export default UserModal;
