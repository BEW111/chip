import React, {useState} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import {
  Button,
  IconButton,
  TextInput,
  Surface,
  Divider,
  Text,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import FastImage from 'react-native-fast-image';
import profileDefault from '../../assets/profile-default.png';

import {searchUsers, useSearchUsers} from '../firebase/users';
import {styles} from '../styles';
import {useTheme} from 'react-native-paper';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

function UserContainer({user}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: pressed ? '#DDD4' : '#0000',
        padding: 10,
        borderRadius: 10,
      }}>
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
    </Pressable>
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
