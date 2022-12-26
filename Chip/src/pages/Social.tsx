import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, TextInput, Divider, Text, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';

import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import profileDefault from '../../assets/profile-default.png';

import {selectUid, selectInvitesSent, selectFriends} from '../redux/authSlice';
import {
  inviteUser,
  searchUsers,
  useReceivedInvites,
  acceptInvite,
  getUser,
} from '../firebase/users';

import {styles} from '../styles';

interface UserContainerType {
  user: string;
  isFriend?: boolean;
  isAccepted?: boolean;
  isInvited?: boolean;
  isReceived?: boolean;
}

function UserContainer(props: UserContainerType) {
  const {user, isFriend, isAccepted, isInvited, isReceived} = props;

  const [pressed, setPressed] = useState(false);

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

  return (
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
          <FastImage source={profileDefault} style={{width: 48, height: 48}} />
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
            <IconButton icon="paper-plane-outline" iconColor="white" size={18}>
              Send
            </IconButton>
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
  );
}

export default function Social() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [friendsData, setFriendsData] = useState([]);

  const invitesSent = useSelector(selectInvitesSent);
  const friends = useSelector(selectFriends);

  const currentUserUid = useSelector(selectUid);
  const receivedInvites = useReceivedInvites(currentUserUid);

  const onSearch = async (search: string) => {
    if (search) {
      setSearch(search);
      const newUsers = await searchUsers(search);
      setUsers(newUsers);
    } else {
      setSearch(search);
      setUsers([]);
    }
  };

  useEffect(() => {
    Promise.all(friends.map(f => getUser(f))).then(dataArray =>
      setFriendsData(dataArray),
    );
  }, [friends]);

  return (
    <View style={styles.fullPaddedDark}>
      <FocusAwareStatusBar animated={true} barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled">
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            label="Search for users"
            value={search}
            onChangeText={text => onSearch(text)}
            style={{backgroundColor: '#222'}}
            contentStyle={{color: 'white'}}
            left={<TextInput.Icon icon="search-outline" />}
            right={
              <TextInput.Icon
                icon="close-outline"
                onPress={() => setSearch('')}
              />
            }
          />
          <Divider style={styles.dividerSmall} />
          {users.map(user => (
            <View key={user.email}>
              <UserContainer
                user={user}
                isAccepted={friends.includes(user.id)}
                isInvited={invitesSent.includes(user.id)}
              />
              <Divider style={styles.dividerSmall} />
            </View>
          ))}
          <Divider style={styles.dividerSmall} />
          <Text variant="labelLarge" style={{color: 'white'}}>
            Friend requests
          </Text>
          {receivedInvites.map(user => (
            <View key={user.email}>
              <UserContainer
                user={user}
                isAccepted={friends.includes(user.id)}
                isReceived={true}
              />
              <Divider style={styles.dividerSmall} />
            </View>
          ))}
          <Divider style={styles.dividerSmall} />
          <Text variant="labelLarge" style={{color: 'white'}}>
            Friends
          </Text>
          {friendsData.map(user => (
            <View key={user.email}>
              <UserContainer user={user} isFriend={true} />
              <Divider style={styles.dividerSmall} />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  userButtonLabel: {
    fontSize: 12,
    marginHorizontal: 8,
    marginVertical: 4,
  },
});
