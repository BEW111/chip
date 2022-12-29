import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {TextInput, Divider, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

import {selectUid, selectInvitesSent, selectFriends} from '../redux/authSlice';
import {searchUsers, useReceivedInvites, getUser} from '../firebase/usersPublic';

import {styles} from '../styles';

import UserContainer from '../components/Social/UserContainer';

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
