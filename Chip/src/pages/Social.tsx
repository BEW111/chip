import React, {useState} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Button,
  IconButton,
  TextInput,
  Surface,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';

import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import profileDefault from '../../assets/profile-default.png';
import {inviteUser} from '../firebase/users';

import {selectUid} from '../redux/authSlice';
import {searchUsers, useSearchUsers} from '../firebase/users';

import {styles} from '../styles';

function UserContainer({user}) {
  const [pressed, setPressed] = useState(false);

  const currentUserUid = useSelector(selectUid);
  const dispatch = useDispatch();

  console.log(user);

  async function onSendInvite() {
    console.log('onSendInvite');
    const result = await inviteUser(currentUserUid, user.id, dispatch);
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
            <Text variant="titleSmall" style={{color: 'gray'}}>
              {user.email}
            </Text>
          </View>
        </View>
        <IconButton
          size={24}
          iconColor="white"
          icon="person-add-outline"
          onPress={onSendInvite}
        />
      </View>
    </View>
  );
}

export default function Social() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);

  const theme = useTheme();

  const onSearch = async (search: string) => {
    setSearch(search);
    const newUsers = await searchUsers(search);
    setUsers(newUsers);
    console.log(newUsers);
  };

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
            label="Search for friends"
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
              <UserContainer user={user} />
              <Divider style={styles.dividerSmall} />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
